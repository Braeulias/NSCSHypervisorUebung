import {traceSteps} from '../src/trace.ts';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initial,defaults,validate,portal,submit,FLAG,recover,stage,diagnose,checkHandover,requiredNetwork,canStart,nextAction,type State} from '../src/lab.ts';
const minimum={name:'intranet-web',image:'portal',cpu:2,ram:4,disk:20};
test('minimum and larger configurations meet requirements',()=>{for(const config of [minimum,{...minimum,cpu:8,ram:16,disk:200}]){assert.deepEqual(validate(config),{});const s:State={...initial(),inspected:true,config,networkConfirmed:true,network:'company',power:'running'};assert.equal(portal(s),'success');assert.equal(submit({...s,reached:true,failedTest:true,diagnosed:true,handover:true},`  ${FLAG} \n`),'success');}});
test('invalid fields return specific errors and enforce capacity',()=>{assert.equal(Object.keys(validate(defaults)).length,5);assert.ok(validate({...minimum,cpu:9}).cpu);assert.ok(validate({...minimum,ram:17}).ram);assert.ok(validate({...minimum,disk:201}).disk);});
test('off, booting and isolated VM cannot serve portal; correction succeeds',()=>{let s:State={...initial(),config:minimum,network:'isolated',networkConfirmed:true};assert.match(portal(s),/powered off/);s.power='booting';assert.match(portal(s),/still starting/);s.power='running';assert.match(portal(s),/Connection unavailable/);s.power='off';s.network='company';s.power='running';assert.equal(portal(s),'success');});
test('flag requires successful practical steps and exact contents',()=>{assert.match(submit(initial(),FLAG),/first/);assert.match(submit({...initial(),reached:true,failedTest:true,diagnosed:true,handover:true},'wrong'),/does not match/);});
test('reload preserves normal progress and finishes elapsed boot',()=>{const s:State={...initial(),inspected:true,config:minimum,network:'isolated',networkConfirmed:true,power:'booting',bootAt:1000};assert.equal(recover(s,2000).power,'booting');assert.equal(recover(s,4000).power,'running');assert.equal(recover({...s,power:'off'},4000).power,'off');assert.equal(recover({...s,bootAt:NaN},4000).power,'running');assert.deepEqual(recover(null),initial());assert.equal(stage(initial()),0);});

test('network evidence and a correct diagnosis are required',()=>{
 const s:State={...initial(),config:minimum,reached:true};
 assert.match(diagnose(s,'network'),/First start/);
 assert.match(submit(s,FLAG),/investigation/);
 s.failedTest=true;
 assert.match(diagnose(s,'cpu'),/evidence/);
 assert.equal(diagnose(s,'network'),'success');
 s.diagnosed=true;
 assert.match(submit(s,FLAG),/handover/);
 assert.equal(stage({...s,inspected:true,networkConfirmed:true,power:'running'}),5);
});
test('handover uses the actual allocation, requires practical evidence, and accepts zero remaining capacity',()=>{
 for(const config of [minimum,{...minimum,cpu:4,ram:8,disk:40},{...minimum,cpu:8,ram:16,disk:200}]){
 const s:State={...initial(),config,reached:true,failedTest:true,diagnosed:true};
 const answers={cpu:String(8-config.cpu),ram:String(16-config.ram),disk:String(200-config.disk),cloud:'services'};
 assert.equal(checkHandover(s,answers),'success');
 assert.match(checkHandover(s,{...answers,cpu:''}),/CPU/);
 assert.match(checkHandover(s,{...answers,ram:'99'}),/RAM/);
 assert.match(checkHandover(s,{...answers,disk:'99'}),/disk/);
 assert.match(checkHandover(s,{...answers,cloud:'yes'}),/self-service/);
 assert.match(checkHandover({...s,reached:false},answers),/Reach/);
 }
});
test('older saves migrate safely and completed status needs new milestones',()=>{
 const legacy={...initial(),config:minimum,reached:true,complete:true};
 assert.equal(recover(legacy).complete,false);
 assert.equal(recover({...legacy,failedTest:true,diagnosed:true,handover:true}).complete,true);
});

test('guided network sequence blocks starting on the wrong network',()=>{
 const s:State={...initial(),inspected:true,config:minimum,network:'company',networkConfirmed:true};
 assert.equal(requiredNetwork(s),'isolated');
 assert.equal(canStart(s),false);
 assert.match(nextAction(s),/Isolated test network/);
 s.network='isolated';
 assert.equal(canStart(s),true);
 s.power='booting';assert.equal(canStart(s),false);
 s.power='running';s.failedTest=true;
 assert.match(nextAction(s),/Check diagnosis/);
 s.diagnosed=true;
 assert.equal(requiredNetwork(s),'company');
 assert.match(nextAction(s),/Shut down/);
 s.power='off';assert.equal(canStart(s),false);
 s.network='company';s.networkConfirmed=false;
 assert.equal(canStart(s),false);
 s.networkConfirmed=true;assert.equal(canStart(s),true);
});
test('saved early company-network progress returns to a guided powered-off state',()=>{
 const s:State={...initial(),inspected:true,config:minimum,network:'company',networkConfirmed:true,power:'running',reached:true};
 const restored=recover(s);
 assert.equal(restored.network,'none');assert.equal(restored.power,'off');assert.equal(restored.reached,false);
 assert.deepEqual(restored.config,minimum);
 assert.match(nextAction(restored),/Isolated test network/);
 assert.equal(recover({...s,failedTest:true,diagnosed:true}).power,'running');
});

test('request trace stops at the network boundary for disconnected or isolated VMs',()=>{
 for(const network of ['none','isolated'] as const){
 const s:State={...initial(),config:minimum,network,power:'running'};
 const steps=traceSteps(s);
 assert.deepEqual(steps.map(step=>step.node),['workstation','network']);
 assert.equal(steps.at(-1)?.kind,'blocked');
 assert.equal(s.failedTest,false); // Pure visualization cannot award mission evidence.
 }
});
test('request trace distinguishes network connectivity from VM readiness',()=>{
 for(const power of ['off','booting'] as const){
 const steps=traceSteps({...initial(),config:minimum,network:'company',power});
 assert.deepEqual(steps.map(step=>step.node),['workstation','network','vm']);
 assert.equal(steps.at(-1)?.kind,'blocked');
 assert.match(steps.at(-1)!.message,power==='off'?/powered off/:/still starting/);
 }
 const absent=traceSteps({...initial(),network:'company'});
 assert.match(absent.at(-1)!.message,/no VM/);
});
test('a running company-connected VM produces a complete successful trace',()=>{
 const steps=traceSteps({...initial(),config:minimum,network:'company',power:'running'});
 assert.deepEqual(steps.map(step=>step.node),['workstation','network','vm','portal']);
 assert.deepEqual(steps.map(step=>step.kind),['pass','pass','pass','success']);
});

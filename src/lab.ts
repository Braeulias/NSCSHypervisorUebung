export const FLAG = 'FLAG{VM_ERFOLGREICH_GESTARTET}';
export const KEY = 'alpentech-lab-interactive-v1';
export type Config = {name:string; image:string; cpu:number; ram:number; disk:number};
export type Network = 'company'|'isolated'|'none';
export type State = {config:Config|null; network:Network; networkConfirmed:boolean; power:'off'|'booting'|'running'; bootAt:number; inspected:boolean; reached:boolean; complete:boolean; failedTest:boolean; diagnosed:boolean; handover:boolean};
export const initial = ():State => ({config:null,network:'none',networkConfirmed:false,power:'off',bootAt:0,inspected:false,reached:false,complete:false,failedTest:false,diagnosed:false,handover:false});
export const defaults:Config={name:'',image:'empty',cpu:1,ram:2,disk:10};
export function validate(c:Config):Partial<Record<keyof Config,string>> {
 const e:Partial<Record<keyof Config,string>>={};
 if(c.name.trim()!=='intranet-web') e.name='Use the required name: intranet-web.';
 if(c.image!=='portal') e.image='Choose the prepared portal image. An empty installation has no portal.';
 for(const [key,min,max] of [['cpu',2,8],['ram',4,16],['disk',20,200]] as const) if(!Number.isFinite(c[key])||c[key]<min||c[key]>max)e[key]=`Choose at least ${min}, within the host capacity of ${max}.`;
 return e;
}
export function ready(s:State){return !!s.config&&Object.keys(validate(s.config)).length===0&&s.network==='company'&&s.power==='running';}
export function portal(s:State){return !s.config?'Create a VM first.':s.power==='off'?'The server is powered off. Start the VM, then try again.':s.power==='booting'?'The VM is still starting. Wait until it is running, then retry.':s.network!=='company'?'Connection unavailable. The employee workstation is on the company network. Shut down the VM, edit its network, and restart.':'success';}
export function submit(s:State,flag:string){return !s.reached?'Reach the employee portal through the simulated browser first.':!s.diagnosed?'Complete the isolated-network investigation and diagnosis first.':!s.handover?'Complete the resource and cloud handover check first.':flag.trim()!==FLAG?'That flag does not match. Copy the full flag from the employee portal.':!ready(s)?'The final server must be running on the company network. Restart and verify the portal before submitting.':'success';}
export function recover(raw:unknown,now=Date.now()):State {
 try {const s=raw as State;if(!s||typeof s.inspected!=='boolean'||!['company','isolated','none'].includes(s.network)||!['off','booting','running'].includes(s.power))return initial();
 if(s.config&&Object.keys(validate(s.config)).length)return initial();
 if(!s.config)return {...initial(),inspected:s.inspected};
 const power=s.power==='booting'&&(!Number.isFinite(s.bootAt)||now-s.bootAt>=2700||s.bootAt>now)?'running':s.power;
 if(!s.diagnosed&&s.network==='company')return {...s,power:'off',network:'none',networkConfirmed:false,reached:false,handover:false,complete:false,failedTest:!!s.failedTest,diagnosed:false};
 return {...s,power,networkConfirmed:!!s.networkConfirmed,reached:!!s.reached,failedTest:!!s.failedTest,diagnosed:!!s.diagnosed&&!!s.failedTest,handover:!!s.handover&&!!s.reached,complete:!!s.complete&&!!s.reached&&!!s.diagnosed&&!!s.failedTest&&!!s.handover};
 }catch{return initial();}
}
export function stage(s:State){return s.complete?6:!s.inspected?0:!s.config?1:!s.networkConfirmed?2:s.power!=='running'?3:!s.reached||!s.diagnosed?4:5;}

export function diagnose(s:State,answer:string){
 if(!s.failedTest)return 'First start the VM on the isolated test network and test the portal.';
 return answer==='network'?'success':'Look at the evidence: the VM is running and the portal template is installed. What separates it from the employee workstation?';
}
export function checkHandover(s:State,answers:{cpu:string;ram:string;disk:string;cloud:string}){
 if(!s.reached||!s.config)return 'Reach the employee portal before completing the handover.';
 if(!s.diagnosed)return 'Complete the network investigation first.';
 const expected={cpu:8-s.config.cpu,ram:16-s.config.ram,disk:200-s.config.disk};
 for(const key of ['cpu','ram','disk'] as const)if(answers[key].trim()===''||Number(answers[key])!==expected[key])return `Check remaining ${key==='cpu'?'CPU cores':key==='ram'?'RAM (GB)':'disk (GB)'}: subtract your VM allocation from the host capacity. Assume this VM is running.`;
 if(answers.cloud!=='services')return 'A host running a VM does not provide the self-service, automation and pooled management expected of a private cloud.';
 return 'success';
}

export function requiredNetwork(s:State):Network {return s.diagnosed?'company':'isolated';}
export function canStart(s:State){return !!s.config&&s.power==='off'&&s.networkConfirmed&&s.network===requiredNetwork(s);}
export function nextAction(s:State):string {
 if(!s.inspected)return 'Read the assignment, inspect the host capacity, then click Create VM in Host overview.';
 if(!s.config)return 'Fill in the VM form using the requirements in Your mission, then click Create virtual machine.';
 if(!s.diagnosed&&s.failedTest)return 'The expected failed test is recorded. In Explain the connection failure, choose the cause and click Check diagnosis. Keep the VM as it is until your diagnosis is accepted.';
 if(s.power==='booting')return 'Wait for the VM status to change from Starting to Running. Then use Open portal or Retry in Employee workstation.';
 if(s.network!==requiredNetwork(s)||!s.networkConfirmed){
 if(s.power==='running')return 'Click Shut down in Virtual machine. Then select Company network, click Save network and click Start VM.';
 return s.diagnosed?'In Virtual machine, select Company network, click Save network, then click Start VM.':'In Virtual machine, select Isolated test network, click Save network, then click Start VM. Company network unlocks after your diagnosis.';
 }
 if(s.power==='off')return 'Click Start VM in Virtual machine. When its status is Running, click Open portal or Retry in Employee workstation.';
 if(!s.failedTest)return 'Click Open portal or Retry in Employee workstation. A connection failure on the isolated network is expected and is part of the assignment.';
 if(!s.reached)return 'Click Open portal or Retry in Employee workstation to verify that your repaired connection works.';
 if(!s.handover)return 'In Operations handover, calculate remaining host resources and answer the cloud question. Click Check handover.';
 return 'Copy the flag from the employee portal into Completion flag, then click Check flag.';
}

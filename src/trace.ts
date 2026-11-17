import type {State} from './lab';
export type TraceNode = 'workstation' | 'network' | 'vm' | 'portal';
export type TraceStep = {node:TraceNode; kind:'pass'|'blocked'|'success'; message:string};

// A teaching model of a service request, not a packet capture or real network probe.
export function traceSteps(s:State):TraceStep[] {
 const steps:TraceStep[]=[{node:'workstation',kind:'pass',message:'The employee workstation sends a request for the employee portal on the company network.'}];
 if(s.network!=='company')return [...steps,{node:'network',kind:'blocked',message:s.network==='isolated'?'Stopped at the network boundary: the VM is in the isolated test network. There is no path from the company workstation.':'Stopped at the network boundary: the VM has no network connection.'}];
 steps.push({node:'network',kind:'pass',message:'The VM is connected to Company network. The request can reach its virtual network adapter.'});
 if(!s.config||s.power!=='running')return [...steps,{node:'vm',kind:'blocked',message:!s.config?'There is no VM to receive the request.':s.power==='booting'?'The VM is still starting. Its prepared portal service is not ready.':'The VM is powered off. A connected network alone cannot provide a running service.'}];
 return [...steps,{node:'vm',kind:'pass',message:`${s.config.name} is running. Its virtual hardware supports the prepared Ubuntu portal environment.`},{node:'portal',kind:'success',message:'The employee portal responds successfully. Both the running server and the correct network connection are needed.'}];
}

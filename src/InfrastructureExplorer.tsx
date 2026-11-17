import {useState} from 'react';
import type {State} from './lab';
import {traceSteps,type TraceNode} from './trace';

type Inspector = TraceNode|'host';
const labels:Record<Inspector,string>={host:'Physical host',workstation:'Employee workstation',network:'Virtual network',vm:'Virtual machine',portal:'Portal service'};
const icons:Record<Inspector,string>={host:'▤',workstation:'▱',network:'⇄',vm:'▣',portal:'◎'};

export function InfrastructureExplorer({state:s,onTest}:{state:State;onTest:()=>void}){
 const [selected,setSelected]=useState<Inspector>('host');
 const [prediction,setPrediction]=useState('');
 const [position,setPosition]=useState(-1);
 const steps=traceSteps(s);
 const active=steps[position];
 const done=position===steps.length-1;
 const descriptions:Record<Inspector,string>={
  host:`alpen-host-01 runs the Type 1 hypervisor. Its physical capacity is 8 CPU cores, 16 GB RAM and 200 GB storage. ${s.config?`The VM reserves ${s.config.disk} GB disk; ${s.power==='off'?'CPU and RAM are currently idle.':`${s.config.cpu} vCPUs and ${s.config.ram} GB RAM are currently in use.`}`:'Create a VM to allocate some of this capacity.'}`,
  workstation:'This simulated employee workstation is on Company network. It sends the portal request. Your actual computer does not contact the simulated IP address.',
  network:s.network==='company'?'The VM and the employee workstation are connected through Company network. A network path is available.':s.network==='isolated'?'The VM is on Isolated test network. It has no connection to the company workstation. This is the intentional fault in phase 1.':'The VM has no virtual network connection. There is no path from the workstation.',
  vm:!s.config?'No VM exists yet. The hypervisor must allocate virtual hardware first.':`${s.config.name}: ${s.config.cpu} vCPUs, ${s.config.ram} GB RAM and ${s.config.disk} GB disk. Status: ${s.power==='running'?'Running':s.power==='booting'?'Starting':'Powered off'}. Virtual hardware uses the physical host’s resources.`,
  portal:'The web service is included in the prepared template. It needs a running VM and a network path from the workstation. A running VM by itself does not guarantee a reachable website.'
 };
 function advance(){const next=position+1;if(next>=steps.length)return;setPosition(next);setSelected(steps[next].node);if(next===steps.length-1)onTest();}
 return <section className="card explorer" aria-labelledby="explorer-title"><div className="section-head"><div><div className="eyebrow">INTERACTIVE EXPERIMENT · SIMULATED REQUEST</div><h2 id="explorer-title">Follow the connection</h2></div><span className="badge">Click to inspect</span></div><p>Inspect each component, predict where a request will stop, then send it through the network one step at a time.</p>
 <div className="request-map" aria-label="Simulated request path">{(['workstation','network','vm','portal'] as const).map((node,i)=><div className="request-hop" key={node}>{i>0&&<span className="request-arrow" aria-hidden="true">→</span>}<button type="button" aria-pressed={selected===node} onClick={()=>setSelected(node)} className={`map-node ${active?.node===node?`trace-${active.kind}`:''}`}><span className="map-icon" aria-hidden="true">{icons[node]}</span><strong>{labels[node]}</strong><small>{active?.node===node?(active.kind==='blocked'?'✕ Request stopped':active.kind==='success'?'✓ Response received':'● Request here'):'Inspect component'}</small></button></div>)}</div>
 <button type="button" className="host-inspect" aria-pressed={selected==='host'} onClick={()=>setSelected('host')}>▤ Inspect physical host · alpen-host-01</button>
 <div className="component-detail" aria-live="polite"><strong>{labels[selected]}</strong><p>{descriptions[selected]}</p></div>
 <div className="trace-controls"><label htmlFor="prediction">Predict the result for the current configuration</label><select id="prediction" value={prediction} disabled={position>=0} onChange={e=>setPrediction(e.target.value)}><option value="">Where will this request end?</option><option value="network">It stops at the network connection</option><option value="vm">It reaches the VM, but the server is not ready</option><option value="portal">It reaches the portal and receives a response</option></select><div className="actions"><button className="primary" type="button" disabled={!prediction||done} onClick={advance}>{position<0?'Send test request':done?'Trace complete':'Next hop →'}</button>{position>=0&&<button type="button" onClick={()=>{setPosition(-1);setPrediction('');}}>New prediction</button>}</div></div>
 <div className="trace-result" aria-live="polite">{active?<><span className="eyebrow">STEP {position+1} · {active.kind==='blocked'?'STOPPED':active.kind==='success'?'SUCCESS':'IN TRANSIT'}</span><p>{active.message}</p>{done&&<><p className="prediction-feedback">{prediction===active.node?'✓ Your prediction matches the trace.':'↻ Your prediction differed. Compare the stopping point with your prediction, then try again after changing the VM configuration.'}</p><p className="small muted">This trace also performed the portal test below and recorded the relevant mission evidence.</p></>}</>:<p className="muted">Make a prediction, then send the request. No real packets are sent.</p>}</div>
 <p className="small muted">Optional exploration; the regular Open portal button still works. A configuration or power change clears this trace so it always matches the current VM.</p></section>;
}

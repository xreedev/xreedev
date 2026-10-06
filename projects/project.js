(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function inView(els,cb,th=.15){
  if(!('IntersectionObserver' in window)){els.forEach(cb);return}
  const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){cb(e.target);o.unobserve(e.target)}}),{threshold:th});
  els.forEach(el=>o.observe(el));
}
// reveal
inView($$('.reveal'),el=>el.classList.add('in'),.1);
// count-up
inView($$('[data-count]'),el=>{
  const end=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length,suf=el.dataset.suffix||'',pre=el.dataset.prefix||'';
  if(reduce){el.textContent=pre+end.toLocaleString()+suf;return}
  const t0=performance.now(),D=1300;
  (function f(t){const p=Math.min(1,(t-t0)/D),e=1-Math.pow(1-p,3);
    el.textContent=pre+(end*e).toLocaleString(undefined,{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;
    if(p<1)requestAnimationFrame(f)})(t0);
});
// bars & stacks
inView($$('.bars .tr i'),el=>{el.style.width=el.dataset.w+'%'});
inView($$('.stack'),el=>{$$('i',el).forEach(i=>{i.style.width=i.dataset.w+'%'})});
// svg: pause SMIL if reduced motion; hover highlight
$$('svg.arch').forEach(svg=>{
  if(reduce&&svg.pauseAnimations)svg.pauseAnimations();
  $$('.node',svg).forEach(n=>{
    n.addEventListener('mouseenter',()=>{
      const id=n.dataset.id,on=new Set([id]);
      svg.classList.add('hl');
      $$('.edge',svg).forEach(e=>{const m=e.dataset.from===id||e.dataset.to===id;e.classList.toggle('on',m);if(m){on.add(e.dataset.from);on.add(e.dataset.to)}});
      $$('.node',svg).forEach(x=>x.classList.toggle('on',on.has(x.dataset.id)));
    });
    n.addEventListener('mouseleave',()=>{svg.classList.remove('hl');$$('.on',svg).forEach(x=>x.classList.remove('on'))});
  });
});
// steppers
$$('.stepper').forEach(st=>{
  const steps=$$('.step',st),panels=$$('.panel',st);let i=0,timer=null,seen=false;
  const dur=(+st.dataset.dur||4.5);st.style.setProperty('--dur',dur+'s');
  function show(n){i=n;steps.forEach((s,k)=>s.classList.toggle('on',k===n));panels.forEach((p,k)=>p.classList.toggle('on',k===n))}
  function play(){clearInterval(timer);if(reduce||st.classList.contains('paused'))return;timer=setInterval(()=>{show((i+1)%steps.length)},dur*1000)}
  steps.forEach((s,k)=>s.addEventListener('click',()=>{st.classList.add('paused');clearInterval(timer);show(k)}));
  show(0);
  inView([st],()=>{seen=true;play()},.3);
  st.addEventListener('mouseenter',()=>{clearInterval(timer)});
  st.addEventListener('mouseleave',()=>{if(seen)play()});
});
// morph rows cycle
$$('.morph').forEach(m=>{
  const rows=$$('.row',m);if(!rows.length)return;let i=0;
  const set=n=>rows.forEach((r,k)=>r.classList.toggle('on',reduce||k<=n));
  set(0);if(reduce)return;
  inView([m],()=>{setInterval(()=>{i=(i+1)%(rows.length+1);set(i===rows.length?0:i)},1700)},.3);
});
// toc highlight + progress bar
const secs=$$('section.blk[id]'),links=$$('.toc a'),bar=$('.progress');
function $(s){return document.querySelector(s)}
addEventListener('scroll',()=>{
  let cur='';secs.forEach(s=>{if(scrollY>=s.offsetTop-120)cur=s.id});
  links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+cur));
  if(bar){const h=document.documentElement.scrollHeight-innerHeight;bar.style.width=(h>0?scrollY/h*100:0)+'%'}
},{passive:true});
})();

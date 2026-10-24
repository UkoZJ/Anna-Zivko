import './style.css';
import { languages, translations, pickLocale } from './i18n.js';
import {icon} from './art.js';
import {introduction,publicSections,connectVenueSlider} from './public-sections.js';
import { eventConfig } from './config.js';
import { rsvpNavigation, invitationFromURL } from './navigation.js';
let invitationToken = invitationFromURL(location.href);
const showDemo=import.meta.env.DEV&&new URLSearchParams(location.search).get('preview')==='rsvp';
let locale = pickLocale();
let variant = new URLSearchParams(location.search).get('variant') || 'A';
if (!['A','B','C'].includes(variant)) variant='A';
let dialogTrigger;
const app = document.querySelector('#app');
const t = key => translations[locale][key];
function render(){document.documentElement.lang=locale; document.title=t('brand'); app.innerHTML=`<a href="#main" class="skip-link">${t('skip')}</a><header><a class="wordmark" href="#">${icon('spark')} ${t('brand')}</a><nav aria-label="${t('brand')}"><a href="#day">${t('day')}</a><a href="#weekend">${t('info')}</a><a href="#stay">${t('stayNav')}</a></nav><div class="header-actions"><label class="sr-only" for="language">${languages[locale]}</label><select id="language">${Object.entries(languages).map(([key,name])=>`<option value="${key}" ${key===locale?'selected':''}>${name}</option>`).join('')}</select><a id="header-confirmation" class="button button-small" href="#rsvp">${t('rsvp')} ↗</a></div></header><main tabindex="-1" id="main" class="variant-${variant}">${introduction(t,variant,import.meta.env.BASE_URL)}${publicSections(t,import.meta.env.BASE_URL)}<section class="rsvp-section" id="rsvp"><span class="kicker">04 / ${t('attendance')}</span><h2>${t('rsvpTitle')}</h2><p>${t('rsvpText')}</p>${invitationToken?`<button class="button button-light" id="open-rsvp">${t('rsvp')} ↗</button>`:''}<p id="rsvp-message" role="status">${invitationToken?'':t('missingInvitation')}</p>${showDemo?`<button class="text-link" id="open-demo">${t('demoLabel')}</button>`:''}${invitationToken?`<p class="rsvp-footnote">${t('personalLink')}</p>`:''}<div class="deadline"><span>${t('deadline')}</span><strong>${eventConfig.rsvpDeadline?new Intl.DateTimeFormat(locale,{timeZone:eventConfig.timeZone,dateStyle:'long',timeStyle:'short'}).format(new Date(eventConfig.rsvpDeadline)):t('deadlinePending')}</strong></div></section></main><footer><a class="wordmark" href="#">${t('brand')} ✧</a><details><summary>${t('privacy')}</summary><p>${t('privacyText')}</p></details></footer>${import.meta.env.DEV?`<div class="prototype-switcher"><button id="prev-variant" aria-label="${t('switchPrev')}">←</button><span>${variant} / ${t({A:'aName',B:'bName',C:'cName'}[variant])}</span><button id="next-variant" aria-label="${t('switchNext')}">→</button></div>`:''}<dialog id="rsvp-dialog" aria-labelledby="dialog-title"><div id="rsvp-app"></div></dialog>`;
connectVenueSlider(app,t,import.meta.env.BASE_URL);
document.querySelector('#language').addEventListener('change',e=>{locale=e.target.value;sessionStorage.setItem('wedding-language',locale);updateURL();render();});
document.querySelector('#open-rsvp')?.addEventListener('click',openInvitation);
for(const selector of ['#header-confirmation','#home-confirmation'])document.querySelector(selector)?.addEventListener('click',event=>{if(invitationToken)openInvitation(event);});
document.querySelector('#open-demo')?.addEventListener('click', async e=>{dialogTrigger=e.currentTarget; const {openRSVP}=await import('./rsvp-demo.js');openRSVP(document.querySelector('#rsvp-dialog'),t,()=>dialogTrigger?.focus());});

document.querySelector('#prev-variant')?.addEventListener('click',()=>cycle(-1));document.querySelector('#next-variant')?.addEventListener('click',()=>cycle(1)); }
function openInvitation(event){event?.preventDefault();const preferred=[new URL(location.href).searchParams.get('lang'),sessionStorage.getItem('wedding-language')].find(value=>Object.hasOwn(languages,value));const result=rsvpNavigation(eventConfig.appsScriptUrl,invitationPage(),preferred);if(result.href)location.assign(result.href);else{document.querySelector('#rsvp-message').textContent=t(result.error==='invitation'?'missingInvitation':'missingConfiguration');document.querySelector('#rsvp').scrollIntoView();}}
function invitationPage(){const url=new URL(location.href);if(invitationToken){url.searchParams.delete('invite');url.hash=new URLSearchParams({invite:invitationToken}).toString();}return url.href;}
function updateURL(){const url=new URL(invitationPage());url.searchParams.set('lang',locale);url.searchParams.set('variant',variant);history.replaceState({},'',url);}
function cycle(direction){const list=['A','B','C'];variant=list[(list.indexOf(variant)+direction+3)%3];updateURL();render();}
// Keep the invitation fragment while moving between public sections.
document.addEventListener('click',e=>{if(e.defaultPrevented)return;const link=e.target.closest('a[href^="#"]');if(!invitationToken||!link)return;e.preventDefault();const id=link.getAttribute('href').slice(1);const target=document.getElementById(id||'app');target?.scrollIntoView();if(id==='main')target?.focus();});
document.addEventListener('keydown',e=>{if(!import.meta.env.DEV || document.querySelector('dialog[open]') || e.target.closest('input,textarea,select,button,a,video,summary,.venue-slider,[contenteditable]'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();cycle(e.key==='ArrowLeft'?-1:1);}});
// Opening a personal link in an existing homepage tab can change only the hash.
// That is a same-document navigation: refresh invitation context without a reload.
function syncInvitation(){const current=invitationFromURL(location.href);if(current!==invitationToken){invitationToken=current;render();}}
window.addEventListener('hashchange',syncInvitation);
window.addEventListener('popstate',syncInvitation);
render();
if(import.meta.env.DEV&&new URLSearchParams(location.search).get('preview')==='rsvp')document.querySelector('#open-demo').click();

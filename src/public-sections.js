import {oak,cliffs,icon} from './art.js';
import {eventConfig} from './config.js';

export const venueSlides = [['surroundings','surroundingsCaption'],['masia','venueCaption'],['family-exterior','familyExteriorCaption']];
export const nearbyStays = [
 ['Hostal Cabrerès','guesthouseType','https://www.hostalcabreres.cat/ca'],
 ['Ca la Rotllada','apartmentsType','https://www.calarotllada.com/'],
 ['Mas Arimany','ruralType','https://www.masarimany.com/'],
];
export function photo(base,name,caption,t,{eager=false}={}){
 return `<figure><img src="${base}venue/${name}.webp" width="960" height="640" loading="${eager?'eager':'lazy'}" decoding="async" alt="${t(caption)}"><figcaption>${t(caption)}</figcaption></figure>`;
}
export function introduction(t,variant,base){
 return `<section class="hero hero-${variant.toLowerCase()}"><div class="hero-copy"><span class="kicker">${t('brand')}</span><h1>${t('hero1')}<br><em>${t('hero2')}</em></h1><div class="weekend-invitation"><p class="weekend-date">${t('weekendDates')}</p><h2>${t('weekendInvite')}</h2><p>${t('weekendLead')}</p></div><div class="hero-confirmation"><a id="home-confirmation" class="button" href="#rsvp">${t('confirmHome')} ↗</a></div><div class="event-facts"><div><span class="tiny">${t('date')}</span><strong>${t('eventDate')}</strong></div><div><span class="tiny">${t('location')}</span><strong>${t('eventVenue')}</strong></div></div><a href="#weekend" class="text-link">${t('weekendLink')} ↓</a></div><div class="hero-oak">${oak()}</div></section>
 <section class="venue-slider" role="region" aria-roledescription="${t('carousel')}" aria-label="${t('sliderLabel')}" tabindex="0"><div id="venue-slide">${photo(base,...venueSlides[0],t,{eager:true})}</div><div class="slider-controls"><button type="button" id="previous-photo" aria-label="${t('previousPhoto')}" aria-controls="venue-slide">←</button><p id="photo-status" role="status" aria-live="polite" aria-atomic="true">${t('photoLabel')} 1 / ${venueSlides.length}</p><button type="button" id="next-photo" aria-label="${t('nextPhoto')}" aria-controls="venue-slide">→</button></div></section>`;
}
function saturday(t){
 return `<section class="section timeline" id="day"><div class="section-head"><span class="kicker">01 / ${t('day')}</span><h2>${t('timelineTitle')}</h2><p>${t('timelineIntro')}</p></div><div class="timeline-grid">${[['way','arrival','12:00'],['rings','ceremony','12:30–13:00'],['glass','aperitif','13:30'],['plate','dinner','15:30'],['spark','party','19:00']].map(([i,title,time])=>`<article><div class="timeline-icon">${icon(i)}</div><span class="tiny">${time}</span><h3>${t(title)}</h3><p>${t(title+'Text')}</p></article>`).join('')}</div><div class="saturday-details"><article><div class="practical-icon">${icon('tie')}</div><h3>${t('dress')}</h3><p>${t('dressText')}</p></article><article><div class="practical-icon">${icon('way')}</div><h3>${t('travel')}</h3><p>${t('travelText')}</p><p class="venue-address">${eventConfig.venueAddress}</p><a class="text-link venue-map" href="${eventConfig.venueMapsUrl}" target="_blank" rel="noopener noreferrer">${t('openMaps')} ↗</a></article></div></section>`;
}
function weekend(t){
 return `<section class="section weekend-section" id="weekend"><div class="section-head"><span class="kicker">02 / ${t('weekendDates')}</span><div class="cliff-accent">${cliffs()}</div><h2>${t('weekendTitle')}</h2><p>${t('weekendIntro')}</p></div><div class="weekend-days">${['friday','sunday'].map(day=>`<article><h3>${t(day+'Title')}</h3><p class="day-time">${t(day+'Time')}</p><p>${t(day+'Text')}</p></article>`).join('')}</div><div class="weekend-practical"><div class="swimwear-icon">${icon('swimwear')}</div><p>${t('weekendPractical')}</p></div><a href="#stay" class="text-link">${t('stayNav')} ↓</a></section>`;
}
function accommodation(t,base){
 return `<section class="section accommodation-section" id="stay"><div class="section-head"><span class="kicker">03 / ${t('stayNav')}</span><h2>${t('accommodationTitle')}</h2><p>${t('accommodationIntro')}</p></div><div class="accommodation-grid"><article class="accommodation-card"><h3>${t('sharedTitle')}</h3><p>${t('sharedText')}</p>${photo(base,'shared-interior','sharedCaption',t)}<details class="sleeping-tour"><summary>${t('videoTitle')}</summary><p id="tour-description">${t('videoDescription')}</p><video controls playsinline preload="none" poster="${base}venue/shared-tour-poster.webp" aria-label="${t('videoTitle')}" aria-describedby="tour-description"><source src="${base}venue/shared-tour.mp4" type="video/mp4"></video><div class="bunks-photo">${photo(base,'shared-bunks','bunksCaption',t)}</div></details></article><article class="accommodation-card"><h3>${t('familyTitle')}</h3><p>${t('familyText')}<em class="family-reserved">${t('familyReserved')}</em></p>${photo(base,'family-room','familyCaption',t)}</article><article class="accommodation-card"><h3>${t('camperTitle')}</h3><p>${t('camperText')}</p>${photo(base,'parking','parkingCaption',t)}</article><article class="accommodation-card nearby-card"><h3>${t('nearbyTitle')}</h3><p>${t('nearbyIntro')}</p>${photo(base,'ca-la-rotllada','nearbyCaption',t).replace('<figcaption>','<figcaption><a href="https://www.calarotllada.com/" target="_blank" rel="noopener noreferrer">').replace('</figcaption>','</a></figcaption>')}<div class="nearby-accommodation"><ul>${nearbyStays.map(([name,type,url])=>`<li><div><h4>${name}</h4><p>${t(type)}</p></div><a href="${url}" target="_blank" rel="noopener noreferrer" class="text-link" aria-label="${name}: ${t('visitWebsite')}">${t('visitWebsite')} ↗</a></li>`).join('')}</ul></div></article></div><p class="request-note">${t('requestNote')}</p><details class="gifts"><summary>${t('giftsTitle')}</summary><p>${t('giftsText')}</p></details></section>`;
}
export function publicSections(t,base){return saturday(t)+weekend(t)+accommodation(t,base);}
export function connectVenueSlider(root,t,base){
 let index=0;
 const show=direction=>{
  index=(index+direction+venueSlides.length)%venueSlides.length;
  root.querySelector('#venue-slide').innerHTML=photo(base,...venueSlides[index],t,{eager:true});
  root.querySelector('#photo-status').textContent=`${t('photoLabel')} ${index+1} / ${venueSlides.length}`;
 };
 root.querySelector('#previous-photo').onclick=()=>show(-1);
 root.querySelector('#next-photo').onclick=()=>show(1);
 root.querySelector('.venue-slider').addEventListener('keydown',e=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  e.preventDefault();e.stopPropagation();
  if(e.key==='Home'){index=1;show(-1);}else if(e.key==='End'){index=0;show(-1);}else show(e.key==='ArrowLeft'?-1:1);
 });
 root.querySelector('.sleeping-tour').addEventListener('toggle',e=>{if(!e.currentTarget.open)e.currentTarget.querySelector('video').pause();});
}

export const accommodationLabels = {
  "ca": [
    "Preferència d’allotjament",
    "Quan rebem totes les preferències, intentarem distribuir els grups en l’espai disponible i us confirmarem les places. La casa familiar és per a familiars directes autoritzats; si hi queden habitacions lliures, avisarem altres grups més endavant. La preferència no és una reserva.",
    "Sense resposta",
    "Casa familiar · familiars directes",
    "Casa de pedra · 29 llits individuals i lliteres",
    "Hostals i apartaments dels voltants",
    "No ens quedem a dormir",
    "Encara no ho sabem",
    "Quines nits us quedeu?",
    "Només divendres",
    "Només dissabte",
    "Divendres i dissabte",
    "Cap nit, només vinc dissabte",
    "Nombre de persones que s’hi quedarien (buit = indecís)",
    "Habitació",
    "Doble",
    "Quàdruple",
    "Indiferent",
    "Reviseu la preferència d’allotjament.",
    "Assignat",
    "Confirmat",
    "Autocaravana",
    "Màxim de persones segons l’assistència: "
  ],
  "es": [
    "Preferencia de alojamiento",
    "Cuando recibamos todas las preferencias, intentaremos distribuir los grupos en el espacio disponible y os confirmaremos las plazas. La casa familiar es para familiares directos autorizados; si quedan habitaciones libres, avisaremos a otros grupos más adelante. La preferencia no es una reserva.",
    "Sin respuesta",
    "Casa familiar · familiares directos",
    "Casa de piedra · 29 camas individuales y literas",
    "Hostales y apartamentos de los alrededores",
    "No nos quedamos a dormir",
    "Todavía no lo sabemos",
    "¿Qué noches os quedáis?",
    "Solo viernes",
    "Solo sábado",
    "Viernes y sábado",
    "Ninguna noche, solo voy el sábado",
    "Número de personas que se quedarían (vacío = indeciso)",
    "Habitación",
    "Doble",
    "Cuádruple",
    "Indiferente",
    "Revisad la preferencia de alojamiento.",
    "Asignado",
    "Confirmado",
    "Autocaravana",
    "Máximo de personas según la asistencia: "
  ],
  "it": [
    "Preferenza di alloggio",
    "Dopo aver ricevuto tutte le preferenze, proveremo a sistemare i gruppi negli spazi disponibili e vi confermeremo i posti. La casa familiare è riservata ai familiari stretti autorizzati; se resteranno camere libere, avviseremo altri gruppi più avanti. La preferenza non è una prenotazione.",
    "Senza risposta",
    "Casa familiare · familiari stretti",
    "Casa in pietra · 29 letti singoli e a castello",
    "Pensioni e appartamenti nei dintorni",
    "Non pernottiamo",
    "Non lo sappiamo ancora",
    "Quali notti restate?",
    "Solo venerdì",
    "Solo sabato",
    "Venerdì e sabato",
    "Nessuna notte, vengo solo sabato",
    "Numero di persone che pernottano (vuoto = indeciso)",
    "Camera",
    "Doppia",
    "Quadrupla",
    "Indifferente",
    "Controllate la preferenza di alloggio.",
    "Assegnato",
    "Confermato",
    "Camper",
    "Numero massimo in base alla presenza: "
  ],
  "sl": [
    "Želja glede nastanitve",
    "Ko prejmemo vse želje, bomo skupine poskusili razporediti v razpoložljive prostore in vam potrdili mesta. Družinska hiša je namenjena izrecno povabljenim ožjim družinskim članom; če bodo sobe ostale proste, bomo pozneje obvestili druge skupine. Želja ni rezervacija.",
    "Brez odgovora",
    "Družinska hiša · ožji družinski člani",
    "Kamnita hiša · 29 enojnih postelj in pogradov",
    "Gostišča in apartmaji v okolici",
    "Ne prespimo",
    "Še ne vemo",
    "Katere noči ostanete?",
    "Samo petek",
    "Samo sobota",
    "Petek in sobota",
    "Ne prespim, pridem samo v soboto",
    "Število oseb, ki bi ostale (prazno = neodločeno)",
    "Soba",
    "Dvoposteljna",
    "Štiriposteljna",
    "Vseeno",
    "Preverite željo glede nastanitve.",
    "Dodeljeno",
    "Potrjeno",
    "Avtodom",
    "Največ oseb glede na udeležbo: "
  ]
};
export const accommodationKeys=['accommodationTitle','accommodationNote','unanswered','family_house','shared','nearby','none','undecided','nights','friday','saturday','both','noNights','numberStaying','roomPreference','double','quadruple','indifferent','ACCOMMODATION','assigned','confirmed','motorhome','accommodationLimit'];
// Shared DOM editor in guest and owner forms. Eligibility always comes from server.
export function accommodationEditor(container,state,value,label,onChange,disabled=false){
 container.replaceChildren();container.classList.add('accommodation-editor');if(!state?.enabled)return;
 value=value??{option:'undecided',nights:'undecided',numberStaying:null,roomPreference:''};
 const heading=document.createElement('h3');heading.textContent=label('accommodationTitle');container.append(heading);
 const field=(key,choices,current,type='select')=>{
  const wrapper=document.createElement('label');wrapper.textContent=label(key);
  const input=document.createElement(type==='select'?'select':'input');input.dataset.accommodation=key;input.disabled=disabled;
  if(type==='select')for(const [v,k] of choices){const option=document.createElement('option');option.value=v;option.textContent=label(k);input.append(option);}
  else{input.type='number';input.min=0;input.max=30;input.step=1;}
  input.value=current??'';wrapper.append(input);container.append(wrapper);return input;
 };
 const redraw=(next,focus)=>{value=next;onChange(next);accommodationEditor(container,state,next,label,onChange,disabled);container.querySelector('[data-accommodation="'+focus+'"]')?.focus();};
 const nights=field('nights',[['undecided','undecided'],['friday','friday'],['both','both'],['saturday','saturday'],['none','noNights']],value.nights);
 nights.onchange=()=>{const night=nights.value;redraw(night==='none'?{option:'none',nights:'none',numberStaying:0,roomPreference:''}:{...value,option:value.option==='none'?'undecided':value.option,nights:night,numberStaying:value.option==='none'?null:value.numberStaying},'nights');};
 const choices=[...(state.familyHouseAllowed?[['family_house','family_house']]:[]),...['shared','motorhome','nearby','undecided','none'].map(k=>[k,k])];
 const choice=field('accommodationTitle',choices,value.option);choice.disabled=disabled||value.nights==='none';
 choice.onchange=()=>{const option=choice.value;redraw({...value,option,nights:option==='none'?'none':value.nights,numberStaying:option==='none'?0:value.numberStaying,roomPreference:option==='family_house'?(value.roomPreference||'indifferent'):''},'accommodationTitle');};
 const count=field('numberStaying',[],value.numberStaying,'number');count.disabled=disabled||value.nights==='none';
 const maximum=Array.isArray(state.members)?state.members.filter(m=>m.attendance!=='no').length:30;count.max=maximum;
 const limit=document.createElement('small');limit.textContent=label('accommodationLimit')+maximum;count.parentElement.append(limit);
 const validateCount=()=>count.setCustomValidity(count.value!==''&&Number(count.value)>maximum?label('accommodationLimit')+maximum:'');validateCount();
 count.oninput=()=>{validateCount();value={...value,numberStaying:count.value===''?null:Number(count.value)};onChange(value);};
 if(value.option==='family_house'){const room=field('roomPreference',['double','quadruple','indifferent'].map(k=>[k,k]),value.roomPreference);room.onchange=()=>{value={...value,roomPreference:room.value};onChange(value);};}
 const note=document.createElement('p');note.textContent=label('accommodationNote');container.append(note);
}
export function accommodationSummary(value,label){return value?label(value.option)+' · '+label(value.nights==='none'?'noNights':value.nights)+' · '+(value.numberStaying??label('undecided'))+(value.roomPreference?' · '+label(value.roomPreference):''):label('unanswered');}

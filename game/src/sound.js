let audio=null,lastSuspicion=0,lastTone=0,alarmPlayed=false,sneaking=false;
function context(){
  if(!audio){const C=window.AudioContext||window.webkitAudioContext;if(C)audio=new C();}
  if(audio?.state==='suspended')audio.resume();return audio;
}
function beep(freq=440,duration=.09,wave='sine',volume=.035,delay=0){
  const ac=context();if(!ac)return;const start=ac.currentTime+delay,osc=ac.createOscillator(),gain=ac.createGain();
  osc.type=wave;osc.frequency.setValueAtTime(freq,start);gain.gain.setValueAtTime(.0001,start);
  gain.gain.exponentialRampToValueAtTime(volume,start+.012);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  osc.connect(gain);gain.connect(ac.destination);osc.start(start);osc.stop(start+duration+.02);
}

export const sound={
  footstep(quiet=false){beep(quiet?190:112,.055,'triangle',quiet ? 0.012 : 0.022);},
  pickup(){beep(587,.14,'sine',.035);beep(784,.2,'sine',.03,.085);},
  toggleSneak(value){sneaking=value;},
  suspicion(value){
    if(value<lastSuspicion-9)alarmPlayed=false;
    if(value>30&&value>lastSuspicion+5&&performance.now()-lastTone>900){
      beep(260+value*2.3,.12,'sine',.018);lastTone=performance.now();
    }
    lastSuspicion=value;
  },
  alarm(){
    if(alarmPlayed)return;alarmPlayed=true;
    beep(480,.32,'sawtooth',.045);beep(610,.32,'sawtooth',.045,.38);beep(480,.38,'sawtooth',.045,.76);
  },
  victory(){alarmPlayed=false;beep(523,.18,'sine',.035);beep(659,.2,'sine',.035,.12);beep(784,.32,'sine',.04,.25);}
};

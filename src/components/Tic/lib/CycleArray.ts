export function cycleArray(arr:any[], amount:number){
  const copy = [...arr];
  for(let i = 0; i < amount; i++){
    copy.push(copy.shift());
  }
  console.log(copy);
  
  return copy;
}
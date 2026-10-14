export type Point={x:number;y:number};
export type Element=({id:string;kind:"line";start:Point;end:Point}|{id:string;kind:"wall";start:Point;end:Point;thickness:number;height:number});
export type Project={schemaVersion:1;name:string;elements:Element[]};
export const emptyProject=():Project=>({schemaVersion:1,name:"Untitled Project",elements:[]});
export const feet=(v:number)=>v*304.8;
export const length=(a:Point,b:Point)=>Math.hypot(b.x-a.x,b.y-a.y);
export function validateProject(v:unknown):Project {
 if(!v||typeof v!=="object")throw Error("Invalid project");
 const p=v as Project;
 if(p.schemaVersion!==1||typeof p.name!=="string"||!Array.isArray(p.elements))throw Error("Unsupported project format");
 for(const e of p.elements){if(!e||typeof e.id!=="string"||!["line","wall"].includes(e.kind)||!e.start||!e.end||![e.start.x,e.start.y,e.end.x,e.end.y].every(Number.isFinite))throw Error("Invalid geometry");if(e.kind==="wall"&&(!Number.isFinite(e.height)||!Number.isFinite(e.thickness)||e.height<=0||e.thickness<=0))throw Error("Invalid wall");}
 return p;
}
export function updateWall(p:Project,id:string,field:"thickness"|"height",value:number):Project{
 if(!Number.isFinite(value)||value<=0)throw Error("Value must be positive");
 return {...p,elements:p.elements.map(e=>e.id===id&&e.kind==="wall"?{...e,[field]:value}:e)};
}

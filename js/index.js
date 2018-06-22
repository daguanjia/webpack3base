import '../css/main.less';
let a='1';

class Point{
    constructor(x){
        this.x=x;
    }
    tosting(){
        return '(' + this.x + ')';
    }
}
let b=new Point(1);

let c=[1,2,2,3,4,5,6,6];
const m=new Set(c);
[...m]
console.log(m,c)

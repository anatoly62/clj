var vector=Array;

function apply(fn){	 
	switch (arguments.length) {
		case 2: return fn.apply(this, vec(arguments[1]));
		case 3: return fn.bind(this,arguments[1]).apply(this,vec(arguments[2]));
		case 4: return fn.bind(this,arguments[1],arguments[2]).apply(this,vec(arguments[3]));
		case 5: return fn.bind(this,arguments[1],arguments[2],arguments[3]).apply(this,vec(arguments[4]));
	}
}

function identity(x){return x;}
function prop(p){return function(it){return it[p];};}
function int_(s){return s.charCodeAt&&s.length===1? s.charCodeAt(0) : Math.floor(s);}
function inc(n) {return n+1;}
function dec(n) {return n-1;}
function count(coll){return coll.length? coll.length : vec(coll).length;}

function completing(f, cf){
	if(arguments.length==1) return completing(f,identity);
	return function(x,y){
		var len=arguments.length;
		if(len===0) return f();
		else if (len===1) return cf(x);
		else return f(x,y);
	};
}

function partial() {
  var args = Array.prototype.slice.call(arguments, 0);
  var f = args.shift();
  return function partialExecute_() {
    var args2 = Array.prototype.slice.call(arguments, 0);
    return f.apply(this, args.concat(args2));
  };
}

function comp(x,y) {
	if(arguments.length===2)	return function(val){return x(y(val));};
  var fns = Array.prototype.slice.call(arguments, 0);
  return function(val) {
    for (var i = fns.length - 1; i >= 0; --i)   val = fns[i](val);
    return val;
  };
}

function unary (fn) {return fn.length === 1?  fn : function (val) {return fn.call(this, val);};}

function memoize(f) {
  return function (x) {
      f.memo = f.memo || {};
			if (arguments.length===1) return (x in f.memo)? f.memo[x] : f.memo[x] = f(x); 
			var args = Array.prototype.slice.call(arguments);
			return (args in f.memo)? f.memo[args] : f.memo[args] = f.apply(this, args);
  }; 
}

function add(a,b){
	if (arguments.length===2) return a+b;
	var sum=0;
	for(var i=0; i<arguments.length;i++)
		sum+=arguments[i];
	return sum;
}

function sub(a,b){
	if (arguments.length===2) return a-b;
	if(arguments.length===0) return 0;
	if(arguments.length===1) return -a;
	var res=a;
	for(var i=1; i<arguments.length;i++)
		res-=arguments[i];
	return res;
}
		
function mul(a,b){
	if (arguments.length===2) return a*b;
	var r=1;
	for(var i=0; i<arguments.length;i++)
		r*=arguments[i];
	return r;
}

function div(a,b){
	if (arguments.length===2) return a/b;
	if(arguments.length===0) return 1;
	var r=a;
	for(var i=0; i<arguments.length;i++)
		r/=arguments[i];
	return r;
}

function mod(a,b){return a%b;}

function max(x,y){
	if(arguments.length===2) return x>y? x : y;
	if(arguments.length===1) return x;
	if(arguments.length===0) return -Number.MAX_VALUE;
	var args = Array.prototype.slice.call(arguments, 0);
	var res=args[0];
	for (var i=1;i<args.length;i++)
		if(args[i]>res) res=args[i];
	return res;	
}

function min(x,y){
	if(arguments.length===2) return x<y? x : y;
	if(arguments.length===1) return x;
	if(arguments.length===0) return Number.MAX_VALUE;
	var args = Array.prototype.slice.call(arguments, 0);
	var res=args[0];
	for (var i=1;i<args.length;i++)
		if(args[i]<res) res=args[i];
	return res;	
}

function maxKey(k,x){
	if(arguments.length===2) return x;
	var y=arguments[2];
	if(arguments.length===3) return k(x)>k(y)? x : y;
	var more=Array.prototype.slice.call(arguments, 3);
	return reduce3(function(r,v)	{
		return maxKey(k,r,v);
	},maxKey(k,x,y),more);
}

function minKey(k,x){
	if(arguments.length===2) return x;
	var y=arguments[2];
	if(arguments.length===3) return k(x)<k(y)? x : y;
	var more=Array.prototype.slice.call(arguments, 3);
	return reduce3(function(r,v)	{
		return minKey(k,r,v);
	},minKey(k,x,y),more);
}

function subvec(args, from, to) {
	switch (arguments.length) {
		case 1:	return subvec(args, 0, args.length);
		case 2:	return subvec(args, from, args.length);
		default:
				var length = Math.max(0, to - from), arr = new Array(length), idx = -1;
				while (++idx < length) 	arr[idx] = args[from + idx];
				return arr;
	}
}

function reverse(arr){
	var res=[].concat(arr);
	res.reverse();
	return res;
}

function clone(m){
	var r={};
	for (var p in m) r[p]=m[p];
	return r;
}

function hashMap(){
	var r={};
	for (var i=0;i<arguments.length;i+=2)	r[arguments[i]]=arguments[i+1];
	return r;		
}

function zipmap(keys, vals) {
  var shorter = keys.length > vals.length ? vals : keys;
  return shorter.reduce(function(map, val, idx) {
    map[keys[idx]] = vals[idx];
    return map;
  }, {});
}

function get(coll,n,nf){var r=coll[n]; return r||r===0? r : nf!==undefined? nf : undefined;}
function keys(o){return Object.keys(o);}

function vals(o){
	var res=[];
	for(var p in o)	res.push(o[p]);
	return res;
}

function assoc(m,k1,v1){return assoc$(isVector(m)? [].concat(m) : clone(m),k1,v1);}
function assoc$(m,k1,v1){
	switch (arguments.length) {
		case 3: m[k1]=v1;
			break;
		case 5: m[k1]=v1;m[arguments[3]]=arguments[4];
			break;
		default:  var args = Array.prototype.slice.call(arguments, 1);
			for (var i=0;i<args.length;i+=2)	m[args[i]]=args[i+1];
	}
		return m;
}

function dissoc(m,k1,k2){
	var r=isVector(m)? [].concat(m) : clone(m);
	switch (arguments.length) {
		case 2: delete r[k1];
			break;
		case 3: delete r[k1];delete r[k2];
			break;
		default:  var args = Array.prototype.slice.call(arguments, 1);
			for (var i=0;i<args.length;i++)	delete r[args[i]];
	}
	return r;
}

function selectKeys(m,v){
	var r={};
	for (var k in m)
		for (var i=0;i<v.length;i++)
			if (k===v[i]) r[k]=m[k];
	return r;
}

function getIn(m,ks,nf){
	for (var i=0;i<ks.length;i++){
		m=m[ks[i]];
		if(m===undefined) return nf===undefined? null : nf;
	}
	return m;	
}

function assocIn(m,ks,v){
	var k=first(ks);ks=next(ks);
	return ks? assoc(m,k,assocIn(get(m,k),ks,v)) : assoc(m,k,v);
}

function assocIn$(m,ks,v){
	var k=first(ks);ks=next(ks);
	return ks? assoc$(m,k,assocIn$(get(m,k),ks,v)) : assoc$(m,k,v);
}

function updateIn(m,ks,fn){
	var args= Array.prototype.slice.call(arguments,3);
	var k=first(ks);ks=next(ks);
	return ks? assoc(m,k,apply(updateIn,get(m,k),ks,fn,args)) : assoc(m,k,apply(fn,get(m,k),args));
}

function merge(){
	var maps= Array.prototype.slice.call(arguments,0);
		return reduce(function(res,it){
			return	conj(res||{},it);},maps);		
}

function mergeWith(fn){
		var maps= Array.prototype.slice.call(arguments,1);
		function mergeEntry(m,e){
			var k=first(e),v=second(e);
			return isContains(m,k)? assoc(m,k,fn(get(m,k),v)) : assoc(m,k,v);
		}
		function merge2(m1,m2){return reduce3(mergeEntry,m1||{},m2);}
		return reduce(merge2,maps);
}

function isOdd(n){return n%2? true : false;}
function isEven(n){return n%2? false : true;}
function isEmpty(x) {return Object(x).length === 0;}
function isNull(x) {return x === null;}
function isZero(x) {return x ===0;}
function isNeg(x) {return x <0;}
function isPos(x) {return x>0;}
function eq(n) {return function(it){return it===n;};}
function gt(n) {return function(it){return it>n;};}
function gte(n) {return function(it){return it>=n;};}
function lt(n) {return function(it){return it<n;};}
function lte(n) {return function(it){return it<=n;};}
function isString(s) {return typeof s === "string" || (typeof s === "object" && s.constructor === String);}
function isNumber(n) {return typeof n == "number";} 
function isFn(x) {return typeof x === "function";}
function isMap(x) {return x instanceof Object && Object.getPrototypeOf(x) === Object.getPrototypeOf({});}
function isVector(a){return Array.isArray(a);}
function isContains(m,k) {return m&&m[k]!==undefined;}

function isIn(v,obj) {
  for (var i=0,l=v.length;i<l;i++) 
    if (v[i]===obj) return true;   
  return false;
}

function some(pred,coll){
	return reduce3(function(res,it){
		return pred(it)? new Reduced(true) : res;
	},null,coll);
}

function isNotAny(pred,coll){
	return reduce3(function(res,it){
		return pred(it)? new Reduced(false) : true;
	},true,coll);
}

function isEvery(pred,coll){
	return reduce3(function(res,it){
		return pred(it)? true : new Reduced(false);
	},true,coll);
}

function isNotEvery(pred,coll){
	return reduce3(function(res,it){
		return pred(it)? false : new Reduced(true);
	},true,coll);
}

function first(coll){
	if (isVector(coll)||isString(coll)) return coll[0];
	else if(coll instanceof LazySeq) return vec(take(1,coll))[0];
	else if(coll.first) return coll.first();
	var it=coll.iterator(), d=it.next();
	return d.done ? null : d.value;
}

function second(coll){
	if (isVector(coll)||isString(coll)) return coll[1];
	else if(coll instanceof LazySeq) return vec(take(2,coll))[1];
	var it=coll.iterator(),d=it.next();
	if (!d.done) d=it(next);
	return d.done ? null : d.value;			
}

function last(coll){
	if (isVector(coll)||isString(coll)) return coll[coll.length-1];
	else if(coll instanceof LazySeq) return last(vec(coll));
	else if(coll.last) return coll.last();	
	var it=coll.iterator(),d=it.next(),r;
	while(!d.done){
		r=d.value;	
		d=it.next();
	}
	return d.value? last(d.value) : r;		
}

function rest(coll){
	if (isVector(coll)||isString(coll)) return subvec(coll,1);
	else if(coll instanceof LazySeq){
		if(isVector(coll.coll)||isString(coll)) return rest(vec(coll));
		else if(coll.coll instanceof Cons) return coll.coll.cdr; 
		else if(coll.coll.iterator) return rest(coll.coll.create(coll));	
	}
	else if(coll.rest) return coll.rest();
		var it=coll.iterator();
		it.next();
		return it.rest();	
}
	
function next(coll){
	var r=rest(coll);
	if(coll.isEmpty)	return r.isEmpty()? null : r;
	return isEmpty(r)? null :r; 
}

function peek(coll){return isVector(coll)? coll[coll.length-1] : coll.peek? coll.peek() : first(coll);}
function pop(coll){return isVector(coll)? subvec(coll,0,coll.length-1) : coll.pop?  coll.pop() :	rest(coll);}	
function butlast(coll){return isVector(coll) || isString(coll)?  subvec(coll,0,coll.length-1) : butlast(vec(coll));}
function ffirst(coll){return isVector(coll)? coll[0][0] : first(first (coll));}
function nfirst(coll){return isVector(coll)? next(coll[0]) : next(first(coll));}
function fnext(coll){return isVector(coll)? next(coll)[0] : first(next(coll));} 
function nnext(coll){return next(next(coll));}

function nth(coll,n){
		if (isVector(coll)||isString(coll)) return coll[n];
		else if(coll instanceof LazySeq) return vec(take(n+1,coll))[n];
		else if(coll.nth) return coll.nth(n);
		var it=coll.iterator(),d=it.next(),r;
		while (!d.done && n){
			r=d.value;	
			d=it.next();
			n--;
		}
		return d.value&&n? nth(d.value,n) : r;			
}

function LazySeq(coll,fn){
	if(coll instanceof LazySeq ){this.coll=coll.coll;this.fn=comp(coll.fn,fn);}
	else {this.coll=coll;this.fn=fn;}		
}
	
function Reduced(val) {this.val=val;}

function lazySeq(coll){return new LazySeq(coll,emptyTransduser);}
function sequence(transducer,coll){return arguments.length ===0?  new LazySeq(coll,emptyTransduser) :	new LazySeq(coll,transducer);}
function into(seq,transducer,coll){return transduce(transducer,conj$,seq,coll);}
function dorun(coll){reduce(function(){},null,coll);}

function concat(arr,coll){
	switch (arguments.length) {
		case 2: return arr.concat(coll);
		case 1: return arr;
		case 0: return [];
		default:
			var arg= Array.prototype.slice.call(arguments, 1);
			return arr.concat.apply(arr,arg);	
	}
}	

function conj(coll, item) {
	var r,i;
	switch (arguments.length) {
		case 2:
			if(coll instanceof LazySeq || coll instanceof Cons) return cons(item,coll);
			else if(isVector(coll)){
				r=new Array(coll.length+1);
				for (i=0;i<r.length-1;i++) r[i]=coll[i];
				r[i]=item;	
			}
			else if (coll.iterator)	return coll.conj(item);			
			else {
				r=clone(coll);
				if(isVector(item))
					for (i=0;i<item.length;i+=2) r[item[i]]=item[i+1];
				else
					for (var p in item)	r[p]=item[p];
			}
			return r;			
	  case 1: return coll;
 		case 0: return [];
		default:
			if(coll instanceof LazySeq || coll instanceof Cons ){
				var cns=cons(item,coll);
				for (i=2;i<arguments.length;i++)
					cns=cons(arguments[i],cns);
				return cns;	
			}
			else if(isVector(coll)){
				coll=coll.slice();
				for (i=1;i<arguments.length;i++) coll.push(arguments[i]);
				return coll;	
				}	
			else if (coll.iterator) {
				for (i=1;i<arguments.length;i++)	coll=coll.conj(arguments[i]);
				return coll;	
			}
			else return merge.apply(this,arguments);		
  }
}

function conj$(coll, item) {
	switch (arguments.length) {
		case 2:
				coll.push(item);
				return coll;
	  case 1: return coll;
 		case 0: return [];
	}	
}

function add$(coll, item) {
	switch (arguments.length) {
		case 2:
				coll.add$(item);
				return coll;
	  case 1: return coll;
 		case 0: return coll.empty();
	}	
}

function remove$(fn,coll){for(var i=0;i<coll.length;i++)	if(fn(coll[i])) coll.splice(i,1);}

function str(s){
	var len=arguments.length;
	var res="";
	for(var i=0; i<len;i++)
		res+=arguments[i];
	return res;
}

function cycle(coll){
	return new LazySeq(function(n){
		return coll[n % coll.length];
		},emptyTransduser);
}

function iterate(fn, x){
	return new LazySeq(function gen(){
		return gen.r=(gen.r!==undefined)? fn(gen.r) : x;
		},emptyTransduser);
}

function range(from,to,step){
	if (arguments.length===0)	return new LazySeq(	function(n){return n;},emptyTransduser);
	if(!step) step=1;
	if (from >= to && step>=0)  return [];
	if(to===undefined) to=from,from=0;
	var i, idx = 0, coll = new Array(Math.floor((Math.floor(to) - Math.ceil(from))/step));
	if (from < to)  
		for (i=from;i< to;i+=step) coll[idx++]=i;
	else
		for (i=from;i>to;i+=step) coll[idx++]=i;
	return new LazySeq(coll,emptyTransduser);
}

function repeat(num,it){
	if (arguments.length===1)	return new LazySeq(	function(){return num;},emptyTransduser);
	var coll=new Array(num);
	for (var i=0;i<num;i++) coll[i]=it;
	return new LazySeq(coll,emptyTransduser);
}
function repeatedly(num,fn){
		if (arguments.length===1)	return new LazySeq(	function(){return num;},emptyTransduser);
		for (var i=0;i<num;i++) fn(); 
}

function mapv(fn,coll,coll2,coll3){
	if(!isVector(coll)&&!isString(coll)) coll=vec(coll);
	var i,r=new Array(coll.length);	
	switch (arguments.length) {
		case 2:
			for (i=0;i<coll.length;i++)
				r[i]=fn(coll[i]);
			return r;		
		case 3:
			for (i=0;i<coll.length;i++)
				r[i]=fn(coll[i],coll2[i]);
			return r;	
		case 4:
			for (i=0;i<coll.length;i++)
				r[i]=fn(coll[i],coll2[i],coll3[i]);
			return r;		
		default:
		  r=new Array(coll.length);
			var len=arguments.length;			
			for (i=0;i<coll.length;i++){
				var it=new Array(len);
				for(var j=1; j<len;j++)
					it[j-1]=arguments[j][i];
				r[i]=fn.apply(null,it);
			}
			return r;
	}		
}

function preReduced(rf){
	return function(result,item){
		var ret=rf(result,item);
		return ret instanceof Reduced ? new Reduced(ret) : ret;
	};
}

function cat(rf){
	var rrf=preReduced(rf);
	return function(result, item) {
		if (arguments.length === 2)	return reduce(rrf,result,item);
		if (arguments.length === 1) return rf(result);
		if (arguments.length === 0) return rf();
	};
}

function mapcat(fn,coll){return arguments.length===1? comp(map(fn),cat) : new LazySeq(coll,mapcat(fn));}

function emptyTransduser(step) {
	return function(result, item) {
		if (arguments.length === 2) return step(result, item);
		if (arguments.length === 1) return step(result);
		if (arguments.length === 0) return step();      
	};
}

function map(fn,coll){
	if (arguments.length===1){ 
		return function(step) {
			return function(result, item) {
				if (arguments.length === 2) return step(result, fn(item));
				if (arguments.length === 1) return step(result);
				if (arguments.length === 0) return step();
			};
		};
	}	
	return new LazySeq(coll,map(fn));	
}

function mapIndexed(fn,coll){
	if (arguments.length===1){ 
		return function(step) {
			var idx=0;
			return function(result, item) {
				if (arguments.length === 2) return step(result, fn(idx++,item));
				if (arguments.length === 1) return step(result);
				if (arguments.length === 0) return step();
			};
		};
	}	
	return new LazySeq(coll,mapIndexed(fn));
}

function filter(fn,coll) {
	if (arguments.length===1){
		return function(step) {
			return function(result, item) {
				if (arguments.length === 2) return  fn(item)? step(result, item) : result;
				if (arguments.length === 1) return step(result);
				if (arguments.length === 0) return step();      
			};
		};
	}	
	return new LazySeq(coll,filter(fn));	
}

function filterv(fn,coll) {vec(filter(fn,coll));}

function remove(fn,coll) {
	if (arguments.length===1){
		return function(step) {
			return function(result, item) {
				if (arguments.length === 2) return  fn(item)? result : step(result, item);
				if (arguments.length === 1) return step(result);
				if (arguments.length === 0) return step();      
			};
		};
	}	
	return new LazySeq(coll,remove(fn));
}

function keep(fn,coll) {
	if (arguments.length===1){
		return function(step) {
			return function(result, item) {
				if (arguments.length === 2) {var it=fn(item); return  it!==null? step(result, it) : result;}
				if (arguments.length === 1) return step(result);
				if (arguments.length === 0) return step();      
			};
		};
	}		
	return new LazySeq(coll,keep(fn));
}

function keepIndexed(fn,coll) {
	if (arguments.length===1){
		return function(step) {
			var idx=0;
			return function(result, item) {
				if (arguments.length === 2) {var it=fn(idx++,item); return  it!==null? step(result, it) : result;}
				if (arguments.length === 1) return step(result);
				if (arguments.length === 0) return step();      
			};
		};
	}		
	return new LazySeq(coll,keepIndexed(fn));
}

function takeNth(n,coll) {
	if (arguments.length===1){
		return function(step) {
			var count = 0;
			return function(result, item) {
				if (arguments.length === 2)	{
					if(count++ % n) return result;
					else return step(result,item);
				}
				if (arguments.length === 1) return step(result);
				if (arguments.length === 0) return step();      
			};
		};
	}	
	return new LazySeq(coll,takeNth(n));	
}

function take(n,coll) {
	if (arguments.length===1){
		return function(step) {
			var count = 0;
			return function(result, item) {
				if (arguments.length === 2) {
					if (count++ < n) return step(result, item);
					else return new Reduced(result);        
				}
				if (arguments.length === 1)  return step(result);      
				if (arguments.length === 0)  return step();
			};
		};
	}	
	return new LazySeq(coll,take(n));
}

function takeLast(n,coll) {
	if (arguments.length===1){
		return function(step) {
			var prev = [];
			var pres;
			var flag=true;
			return function(result, item) {
				if (arguments.length === 2) {
					if(flag) {
						flag=false;
						pres=result;
					}
					prev.push(item);
					return result;	
				}
				if (arguments.length === 1) { 					
					for (var i=prev.length-n;i<prev.length;i++)
						pres=step(pres,prev[i]);
					return pres;
					}
					
				if (arguments.length === 0)  return step();
			};
		};
	}	
	return subvec(coll,coll.length-n);	
}

function takeWhile(fn,coll) {
	if (arguments.length===1){
		return function(step) {
			return function(result, item) {
				if (arguments.length === 2) return  fn(item)? step(result, item) : new Reduced(result);
				if (arguments.length === 1) return step(result);
				if (arguments.length === 0) return step();      
			};
		};
	}	
	return new LazySeq(coll,takeWhile(fn));		
}

function drop(n,coll){
	if (arguments.length===1){
		return function(step) {
			var count = 0;
			return function(result, item) {
				if (arguments.length === 2) {
					if (count++ >= n) return step(result, item);
					else return result;        
				}
				if (arguments.length === 1)  return step(result);      
				if (arguments.length === 0)  return step();
			};
		};
	}	
	return new LazySeq(coll,drop(n));		
}

function dropLast(n,coll){
	if (arguments.length===1){
		return function(step) {
			var prev = [];
			return function(result, item) {
				if (arguments.length === 2) {
					var res=step(result, item);
					prev.push(res);
					return res;					     
				}
				if (arguments.length === 1)  return prev[prev.length-n-1];      
				if (arguments.length === 0)  return step();
			};
		};
	}	
	return subvec(coll,0,coll.length-n);			
}

function dropWhile(fn,coll){
	if (arguments.length===1){
		return function(step) {
			var flg = false;
			return function(result, item) {
				if (arguments.length === 2) {
					if(flg) return step(result, item);
					else if (fn(item)) return result;
					else  {
						flg=true;
						return step(result, item);
						}        
				}
				if (arguments.length === 1)  return step(result);      
				if (arguments.length === 0)  return step();
			};
		};
	}	
	return new LazySeq(coll,dropWhile(fn));		
}

function dedupe(coll){
	if (arguments.length===0){
		return function(step) {
			var prev;
			return function(result, item) {
				if (arguments.length === 2) {
					var p=prev;
					prev=item;
					if (item!==p) return step(result, item);
					else return result;        
				}
				if (arguments.length === 1)  return step(result);      
				if (arguments.length === 0)  return step();
			};
		};
	}	
	return new LazySeq(coll,dedupe());	
}

function distinct(coll){
	if (arguments.length===0){
		return function(step) {
			var prev = [];
			return function(result, item) {
				if (arguments.length === 2) {
					if (prev[item]) return result;
					else{
						prev[item]=1;
						return step(result, item);
					}    
				}
				if (arguments.length === 1)  return step(result);      
				if (arguments.length === 0)  return step();
			};
		};
	}	
	return new LazySeq(coll,distinct());	
}

function interpose(sep,coll){
	if (arguments.length===1){
		return function(step) {
			return function(result, item) {
				if (arguments.length === 2) return step(step(result, item),sep);
				if (arguments.length === 1) return step(result);
				if (arguments.length === 0) return step();
			};
		};
	}	
	return new LazySeq(coll,interpose(sep));		
}

function partition(n,coll) {
	if (arguments.length===1){
		return function(step) {
			var cur = [];
			return function(result, item) {
				if (arguments.length === 2) {
					cur.push(item);
					if (cur.length === n) {
						result = step(result, cur);
						cur = [];
						return result;
					}
					else return result;
				}
				if (arguments.length === 1) return step(result);
				if (arguments.length === 0) return step();
			};
		};
	}	
	return new LazySeq(coll,partition(n));	
}

function partitionAll(n,coll) {
	if (arguments.length===1){
		return function(step) {
			var cur = [];
			return function(result, item) {
				if (arguments.length === 2) {
					cur.push(item);
					if (cur.length === n) {
						result = step(result, cur);
						cur = [];
						return result;
					}
					else return result;
				}
				if (arguments.length === 1) {
					if (cur.length > 0)  result = step(result, cur);       
					return step(result);
				}
				if (arguments.length === 0) return step();
			};
		};
	}	
		return new LazySeq(arguments[1],partitionAll(n));		
}

function partitionBy(fn,coll) {
	if (arguments.length===1){
		return function(step) {
			var part = [];
			var last;
			return function(result, item) {
				if (arguments.length === 2) {
					var current=fn(item);				
					if (current===last || last === undefined) {
						part.push(item);
					}
					else {
						result=step(result,part);
						part = [item];
					}
					last = current;
					return result;
				}
				if (arguments.length === 1) {
					if (part.length > 0)  result = step(result, part);       
					return step(result);
				}
				if (arguments.length === 0) return step();
			};
		};
	}	
	return new LazySeq(coll,partitionBy(fn));			
}

function flatten(coll) {
	if (arguments.length===0){
		return function(step) {
			return function(result, item) {
				if (arguments.length === 2){
					function _flat(arr){
						arr = Array.prototype.concat.apply([], arr);
						return arr.some(isVector) ? flatten(arr) : arr;
					}
					if(isVector(item)) {
						var r=_flat(item);
						for(var i=0;i<r.length;i++)
							result=step(result,r[i]);
						return result;	
					}
					else return step(result, item);
				}			
				if (arguments.length === 1) return step(result);
				if (arguments.length === 0) return step();
			};
		};
	}		
	return new LazySeq(coll,flatten());
}

function transduce(transducer, reduct) {
  var step = transducer(reduct);
	var result=arguments.length==3? reduce(step,step(),arguments[2]) : reduce(step,arguments[2],arguments[3]) ;
  return step(result);
}

function reduce(fn) {
	if(arguments.length===2){
		var coll=arguments[1];
		return coll instanceof LazySeq? reduce(coll.fn(fn),fn(),coll.coll) :  reduce(fn,first(coll),next(coll));
	}
	else	return reduce3(fn,arguments[1],arguments[2]); 
}

function compare(x,y){
	if(x>y) return 1 ;
	else if(x==y) return 0;
	else return -1; 
}

function sort(cmp,coll){
	var r;
	if(arguments.length===1){
		r=vec(cmp).slice();
		r.sort();
	}
	else{
		r=vec(coll).slice();
		r.sort(cmp);
	}
	return r;
}

function sortBy(fn,cmp,coll){
	if(arguments.length===2){
		coll=cmp;
		cmp=compare;
	}
	var	r=vec(coll).slice();
	r.sort(function (x,y){return cmp(fn(x),fn(y));});
	return r;
}

function juxt(f,g,h){
	var args = Array.prototype.slice.call(arguments, 0);
	return function(x){
			var r=[];
			for (var i=0;i<args.length;i++)	r.push(args[i](x));
			return r;
	};
} 

function find(m,k){return m[k]===undefined? null : [k,m[k]];}
function splitAt(n,coll){return [vec(take(n,coll)),vec(drop(n,coll))];}
function splitWith(pred,coll){return [vec(takeWhile(pred,coll)),vec(dropWhile(pred,coll))];}

function replace(smap,coll){
	return isVector(coll)? reduce(function(v,i){
		var e=find(smap,nth(v,i));
		return e? assoc(v,i,second(e)): v;
	},coll,range(count(coll))) :
	map(function(m){
		var e=find(smap,m);
		return e? second(e) : e;
	},coll);
}

function  groupBy(fn,coll){
	return reduce(function(ret,x){
		var k=fn(x);
		return assoc$(ret,k,conj(get(ret,k,[]),x));
	},{},coll);	
}

function frequencies(coll){
	return reduce(function(cnt,x){
		return assoc$(cnt,x,inc(get(cnt,x,0))); 
	},{},coll);
}

function vec(coll){
	if (coll instanceof LazySeq) return transduce(coll.fn,conj$,[],coll.coll);
	if(isVector(coll)) return coll;
	return reduce3(conj$,[],coll);	
}

function reduce3(fn,result,coll){	
	if(isFn(coll)){
		var n=0;
		while(1){
			result = fn(result, isFn(coll(n))? coll(n++)() :  coll(n++));
			if (result instanceof Reduced)return result.val;			
		}
	}
	else if (coll instanceof LazySeq)	return reduce3(coll.fn(fn),result,coll.coll);
	else if(isVector(coll) || isString(coll)){
		for (var i = 0; i < coll.length; i++) {
			result = fn(result, coll[i]);
			if(result instanceof Reduced)	return result.val;
		}
	}	
	else if(coll.iterator){
		var it=coll.iterator();
		var d=it.next();
		while(!d.done){
			result=fn(result,d.value);
			if(result instanceof Reduced)	return result.val;
			d=it.next();
		}
		if(d.value) return d.value instanceof LazySeq? transduce(d.value.fn,fn,result,d.value.coll) : reduce(fn,result,d.value);	
	}
	
	else {
		for (var p in coll){			
			result = fn(result, [p,coll[p]]);
			if(result instanceof Reduced)	return result.val;
		}
	}	
	return result;	
}

function cons(it,coll){return new Cons(it,coll);}
function ConsIterator(cons){this.current=cons;}
function Cons(it,coll){this.car=it;this.cdr=coll;}
Cons.prototype.iterator = function(){ return new ConsIterator(this);};
Cons.prototype.conj = function(d){return cons(d,this);};
ConsIterator.prototype.rest = function(){return this.current;};

ConsIterator.prototype.next = function(){
  if (this.current.car===undefined) return {done:true,value:this.current};
  else{
		var data=this.current.car;
		this.current=this.current.cdr;
		return {done:false,value:data};
	}
};

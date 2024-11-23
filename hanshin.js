const hanshinMap = () => {
	const map = new Map;
	const add = list => {
		list.filter(e=>{
			const er = eval(e)
			if(er % 1 != 0){
				return false;
			}else if(0 > er){
				return false;
			}else{
				return true;
			}
		}).forEach(e=>map.set(eval(e),e))
	}
	let list = []
	const e = ["","+","-","*","/"]
	for(let i = 0;i < 5;i++)
		for(let j = 0;j < 5;j++)
			for(let k = 0;k < 5;k++)
				for(let l = 0;l < 5;l++)
					list.push(`3${e[i]}3${e[j]}43${e[k]}3${e[l]}4`)
	for(let i = 0;i < 5;i++)
		for(let j = 0;j < 5;j++)
			list.push(`3${e[i]}3${e[j]}4`)
	add(list)
	const entry = [["⑨","3/3-4+3+3-4"],[1,"33+4-3*3*4"]]
	map.forEach((v,k)=>entry.push([k,v]))
	return Object.fromEntries(entry)
}

const hanshin = ((Nums) => {
	const numsReversed = Object.keys(Nums).map(x => +x).filter(x => x > 0)
	const getMinDiv = (num) => {
		for (let i = numsReversed.length; i >= 0; i--)
			if (num >= numsReversed[i])
				return numsReversed[i]
	}
	const isDotRegex = /\.(\d+?)0{0,}$/
	const demolish = (num) => {
		if (typeof num !== "number")
			return ""

		if (num === Infinity || Number.isNaN(num))
			throw new Error("cant parse: "+num,{cause:num})

		if (num < 0)
			return `(⑨)*(${demolish(num * -1)})`.replace(/\*\(1\)/g, "")

		if (!Number.isInteger(num)) {
			// abs(num) is definitely smaller than 2**51
			// rescale
			const n = num.toFixed(16).match(isDotRegex)[1].length
			return `(${demolish(num * Math.pow(10, n))})/(10)^(${n})`
		}

		if (Nums[num])
			return String(num)

		const div = getMinDiv(num)
		return (`${div}*(${demolish(Math.floor(num / div))})+` +
			`(${demolish(num % div)})`).replace(/\*\(1\)|\+\(0\)$/g, "")
	}
	//Finisher
	const finisher = (expr) => {
		expr = expr.replace(/\d+|⑨/g, (n) => Nums[n]).replace("^", "**")
		//As long as it matches ([\*|\/])\(([^\+\-\(\)]+)\), replace it with $1$2
		while (expr.match(/[\*|\/]\([^\+\-\(\)]+\)/))
			expr = expr.replace(/([\*|\/])\(([^\+\-\(\)]+)\)/, (m, $1, $2) => $1 + $2)
		//As long as it matches ([\+|\-])\(([^\(\)]+)\)([\+|\-|\)]), replace it with $1$2$3
		while (expr.match(/[\+|\-]\([^\(\)]+\)[\+|\-|\)]/))
			expr = expr.replace(/([\+|\-])\(([^\(\)]+)\)([\+|\-|\)])/, (m, $1, $2, $3) => $1 + $2 + $3)
		//As long as it matches ([\+|\-])\(([^\(\)]+)\)$, replace it with $1$2
		while (expr.match(/[\+|\-]\(([^\(\)]+)\)$/))
			expr = expr.replace(/([\+|\-])\(([^\(\)]+)\)$/, (m, $1, $2) => $1 + $2)
		//If there is a bracket in the outermost part, remove it
		if (expr.match(/^\([^\(\)]+?\)$/))
			expr = expr.replace(/^\(([^\(\)]+)\)$/, "$1")

		expr = expr.replace(/\+-/g,'-')
		return expr
	}
	return (num) => finisher(demolish(num))
})(hanshinMap())

if (typeof module === 'object' && module.exports)
	module.exports = hanshin

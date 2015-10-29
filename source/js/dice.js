//What die to roll {die}, which is 20 for a d20, 8 for a d8, etc.
//A modifier to add to the total, if any.
//Returns an object with the individual results in an array, and the total.
var roll = function(num, die, mod){
	var results = [];
	var total = 0;
	if (num > 0){
		for(var i = 0; i < num; i++){
			var result = Math.floor((Math.random() * die) + 1);
			results.push(result);
			total += result;
		}
	}
	total += mod;
	var obj = {
		total: total,
		results: results,
		num: num,
		die: die,
		mod: mod
	};

	return obj;
};

//Dice interpreter function
//Takes a string of dice to roll
//Eg:  "2d6+1d4+8"
//And then does each roll and totals the results.

var roll_dice = function(die_str){
	var die_str = die_str.replace(/- */,'+ -');
    var die_str = die_str.replace(/D/,'d');
    var re = / *\+ */;
    var items = die_str.split(re);
    var total = 0;
    var result_str = "";
    for(var i in items){
    	var str = items[i];
    	if(str.indexOf("d") > -1){
    		//this is a die roll
    		var parts = str.split("d");
    		var num = parseInt(parts[0]);
    		var die = parseInt(parts[1]);
    		var res = roll(num, die, 0);
    		total += res.total;
    		if(result_str === ""){
    			result_str += "[" + res.results + "]";
    		} else {
    			result_str += " + " + "[" + res.results + "]";
    		}
    	} else {
    		//this is a mod to add
    		var mod = parseInt(str);
    		total += mod;
    		if(result_str === ""){
    			result_str += str;
    		} else {
    			result_str += " + " + str;
    		}
    	}
    }
    console.log(total);
    console.log(result_str);
    var obj = {
    	total: total,
    	result: result_str,
    	orig: die_str
    };
    return obj;
}

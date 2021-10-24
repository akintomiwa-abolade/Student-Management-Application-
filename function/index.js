module.exports ={
	async findOne(modelName, obj){

		return await modelName.findOne({
			where:obj
		});
	},


	async validateEmail(modelName, val){

		return await modelName.findAll({
			where:{
				email:val
			}
		})
	},

	async multiple(modelName, obj){
		return await modelName.findAll({
			where:obj
		})
	},

	async currentYear(){
		var d = new Date(); // Since getMonth() returns month from 0-11 not 1-12
	    var year = d.getFullYear();
	   
	    return year;
	},

	async randomStr(numLength){
	   var result  = '';
	   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   var charactersLength = characters.length;
	   for ( var i = 0; i < numLength; i++ ) {
	      result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	},

	async randomNum(numLength){
	   var result  = '';
	   var characters = '0123456789';
	   var charactersLength = characters.length;
	   for ( var i = 0; i < numLength; i++ ) {
	      result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	},

}
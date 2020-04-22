

if (typeof(cache) === 'undefined'){
    var cache = require('./cache');
}


module.exports.handler = async function(event, context){
    const schedules = await runScheduler(event);
    const [distances, commutes] = await Promise.all(runPaths(schedules), runTripPlanner(schedules));

}

async function runScheduler(event){
    const params = {
        FunctionName: process.env.SCHEDULER,
        Qualifier: 'live',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(event)
    }
    const response = await cache.Lambda.invoke(params).promise();
    return JSON.parse(response.Payload);
}

async function runPaths(schedules){
    const params = {
        FunctionName: process.env.PATHS,

    }
}

async function runTripPlanner(schedules){
    const params = {
        FunctionName: process.env.TRIP
    }
}
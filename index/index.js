

if (typeof(cache) === 'undefined'){
    var cache = require('./cache');
}


module.exports.handler = async function(event, context){
    const schedules = await runScheduler(event);
    const [distances, commutes] = await Promise.all(runPaths(schedules), runTripPlanner(schedules));
    try {
        return schedules.map((s, idx) => {
            return {
                sections: s,
                commute: commutes[idx],
                totalDistance: distances[idx]['totalDistance']
            }
        });
    } catch (error) {
        console.log(error);
    }
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
    return await Promise.all(schedules.map(async s => {
        const params = {
            FunctionName: process.env.PATHS,
            Payload: JSON.stringify(s)
        }
        try {
            const response = await cache.Lambda.invoke(params).promise();
            return JSON.parse(response.Payload);
        } catch (error) {
            console.log(error);
        }
        
    }));
}

async function runTripPlanner(schedules){
    const params = {
        FunctionName: process.env.TRIP,
        Payload: JSON.stringify(schedules)
    }
    try {
        const response = await cache.Lambda.invoke(params).promise();
        const data = JSON.parse(response.Payload);
        return data.map(s => s.pop()['tripPlanner']);
    } catch (error) {
        console.log(error);
    }
}
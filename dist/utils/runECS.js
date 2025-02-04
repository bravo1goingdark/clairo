import { RunTaskCommand, ECSClient } from "@aws-sdk/client-ecs";
const ecsClient = new ECSClient({
    region: "ap-south-1",
});
export const runNewTask = async (bucket, key) => {
    try {
        const runNewTaskCommand = new RunTaskCommand({
            taskDefinition: "arn:aws:ecs:ap-south-1:864981723851:task-definition/clairo-video-transcoder-task:4",
            launchType: "FARGATE",
            cluster: "arn:aws:ecs:ap-south-1:864981723851:cluster/clairo-video-transcoder",
            networkConfiguration: {
                awsvpcConfiguration: {
                    assignPublicIp: "ENABLED",
                    subnets: ["subnet-040e6e983312fe7d1", "subnet-086a9bcdf6a63bfcb", "subnet-0385c054f70bcbf40"],
                    securityGroups: ["sg-089e141d4005c0590"]
                }
            },
            overrides: {
                containerOverrides: [{
                        name: "bravo1goingdark-clairo"
                    }]
            }
        });
        const response = await ecsClient.send(runNewTaskCommand);
        console.log(response);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        process.exit(0);
    }
};

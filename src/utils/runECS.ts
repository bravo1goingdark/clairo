import {RunTaskCommand, ECSClient, RunTaskCommandOutput} from "@aws-sdk/client-ecs";

const ecsClient = new ECSClient({
    region: "ap-south-1",
})


export const runNewTask: (bucket: string, key: string) => Promise<void> = async (bucket: string, key: string): Promise<void> => {
    try {
        const runNewTaskCommand = new RunTaskCommand({
            taskDefinition: "arn:aws:ecs:ap-south-1:864981723851:task-definition/clairo-video-transcoder-task:4",
            launchType: "FARGATE",
            cluster: "arn:aws:ecs:ap-south-1:864981723851:cluster/clairo-video-transcoder",
            networkConfiguration: {
                awsvpcConfiguration: {
                    assignPublicIp: "ENABLED",
                    subnets: ["subnet-040e6e983312fe7d1"],
                    securityGroups: ["sg-089e141d4005c0590"]
                }
            },
            overrides: {
                containerOverrides: [{
                    name: "bravo1goingdark-clairo"
                }]
            }
        })

        const response: RunTaskCommandOutput = await ecsClient.send(runNewTaskCommand);
        console.log(response);
    } catch (err) {
        console.error(err);
    }finally {
        process.exit(0);
    }
}
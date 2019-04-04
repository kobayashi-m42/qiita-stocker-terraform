import {
  createNetworkBackend,
  createAcmBackend,
  createBastionBackend,
  createApiBackend,
  createFrontendBackend,
  createRdsBackend,
  createEcrBackend,
  createEcsBackend,
  createFargateBackend
} from "./createBackend";
import createProvider from "./createProvider";
import {
  createAcmTfvars,
  createBastionTfvars,
  createApiTfvars,
  createFrontendTfvars,
  createRdsTfvars,
  createEcsTfvars,
  createFargateTfvars, createNetworkTfvars
} from "./createTfvars";
import { isAllowedDeployStage, outputPathList } from "./terraformConfigUtil";

(async () => {
  const deployStage: string = <any>process.env.DEPLOY_STAGE;
  if (!isAllowedDeployStage(deployStage)) {
    return Promise.reject(
      new Error("有効なステージではありません。dev, prod が利用出来ます。")
    );
  }

  await createNetworkBackend(deployStage);
  await createAcmBackend(deployStage);
  await createBastionBackend(deployStage);
  await createApiBackend(deployStage);
  await createFrontendBackend(deployStage);
  await createRdsBackend(deployStage);
  await createEcrBackend(deployStage);
  await createEcsBackend(deployStage);
  await createFargateBackend(deployStage);

  const targetDirs = outputPathList();
  targetDirs.forEach(async (dir: string) => {
    await createProvider(deployStage, dir);
  });

  await createNetworkTfvars(deployStage);
  await createAcmTfvars(deployStage);
  await createBastionTfvars(deployStage);
  await createApiTfvars(deployStage);
  await createFrontendTfvars(deployStage);
  await createRdsTfvars(deployStage);
  await createEcsTfvars(deployStage);
  await createFargateTfvars(deployStage);

  return Promise.resolve();
})().catch((error: Error) => {
  console.error(error);
});

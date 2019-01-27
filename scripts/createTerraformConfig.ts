import {
  createNetworkBackend,
  createAcmBackend,
  createBastionBackend,
  createApiBackend,
  createFrontendBackend,
  createRdsBackend
} from "./createBackend";

(async () => {
  const deployStage: string = <any>process.env.DEPLOY_STAGE;

  await createNetworkBackend(deployStage);
  await createAcmBackend(deployStage);
  await createBastionBackend(deployStage);
  await createApiBackend(deployStage);
  await createFrontendBackend(deployStage);
  await createRdsBackend(deployStage);
})();

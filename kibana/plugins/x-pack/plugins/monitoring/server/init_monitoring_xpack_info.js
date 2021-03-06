import { checkLicenseGenerator } from './cluster_alerts/check_license';
import { LOGGING_TAG } from '../common/constants';

/*
 * Expose xpackInfo for the Monitoring cluster as server.plugins.monitoring.info
 */
export const initMonitoringXpackInfo = async server => {
  const config = server.config();
  const xpackInfoOptions = {
    clusterSource: 'monitoring',
    pollFrequencyInMillis: config.get('xpack.monitoring.xpack_api_polling_frequency_millis')
  };
  const xpackInfo = server.plugins.xpack_main.createXPackInfo(xpackInfoOptions);

  xpackInfo.feature('monitoring').registerLicenseCheckResultsGenerator(checkLicenseGenerator);
  server.expose('info', xpackInfo);

  // check if X-Pack is installed on Monitoring Cluster
  const xpackInfoTest = await xpackInfo.refreshNow();
  if (!xpackInfoTest.isAvailable()) {
    server.log([LOGGING_TAG, 'warning'], `X-Pack Monitoring Cluster Alerts will not be available: ${xpackInfoTest.unavailableReason()}`);
  }
};

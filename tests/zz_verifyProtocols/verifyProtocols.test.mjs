import { TIME, SERVICES} from '../../config/constant.mjs';
import { setup, closeBrowser } from '../../service/loginSetup.mjs';
import ProtocolTestRunner from '../../service/ProtocolTestRunner.js';

let page;

describe('TESTE DE PROTOCOLOS', function () {
  this.timeout(TIME.TWO_MINUTES);

  before(async () => {
    page = await setup();
  });

  after(async () => {
    await closeBrowser();
  });

  const testRunner = new ProtocolTestRunner();
  testRunner.runTests();
});

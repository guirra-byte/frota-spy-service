import { IVehicleInfractionProvider } from '../interfaces/Ivehicle-infraction-provider.interface';
import Puppeteer, { Browser } from 'puppeteer';

export class VehicleInfractionProvider implements IVehicleInfractionProvider {
  browser: Browser;
  AUTH: string;

  constructor() {
    async () => {
      this.AUTH = `${process.env.BRIGHT_DATA_USERNAME}:${process.env.BRIGHT_DATA_PASSWORD}`;
      this.browser = await Puppeteer.connect({
        browserWSEndpoint: `wss://${this.AUTH}@brd.superproxy.io:9222`,
      });
    };
  }

  async callIn(): Promise<any> {
    const page = await this.browser.newPage();
    await page.goto(
      'https://sso.acesso.gov.br/login?client_id=portalservicos.denatran.serpro.gov.br',
    );

    const inputLoginCPF = await page.waitForXPath(
      '::-p-xpath(/html/body/div[1]/main/form/div[1]/div[2]/input)',
    );

    const nextLoginBtn = await page.waitForXPath(
      '::-p-xpath(/html/body/div[1]/main/form/div[1]/div[2]/div/button)',
    );

    if (!inputLoginCPF || !nextLoginBtn) {
      throw new Error('XPaths não encontrados!');
    }

    if (process.env.FROTA_SPY_CPF && inputLoginCPF) {
      inputLoginCPF.type(process.env.FROTA_SPY_CPF);
      await page.click(
        '::-p-xpath(/html/body/div[1]/main/form/div[1]/div[2]/div/button)',
      );

      const inputLoginPassword = await page.waitForXPath(
        '::-p-xpath(/html/body/div[1]/main/form/div[1]/div[1]/input)',
      );

      if (inputLoginPassword && process.env.FROTA_SPY_PASSWORD) {
        inputLoginPassword.type(process.env.FROTA_SPY_PASSWORD);

        const infractionsBtn = await page.waitForXPath(
          '::-path-xpath(/html/body/app-root/form/br-main-layout/div/div/main/app-usuario/app-home/div/div[1]/ul/li[3])',
        );

        if (infractionsBtn) {
          await page.click(
            '::-path-xpath(/html/body/ app-root/form/br-main-layout/div/div/main/app-usuario/app-home/div/div[1]/ul/li[3])',
          );
        }
      }
    }
  }
}

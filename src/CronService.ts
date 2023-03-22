import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppService } from './app.service';
import { TokenDistributor } from './TokenDistributor';

@Injectable()
export class CronService {
  contractAddress: string;
  tokenDistributorContract: TokenDistributor;
  claimPeriodBlockStartNumber: number;
  constructor(private appService: AppService) {
  }

  @Cron('*/5 * * * * *') // run every 5 seconds
  async handleCron() {
    console.log('runs every 5 seconds');
    this.claimPeriodBlockStartNumber = this.appService.getClaimPeriodBlockStartNumber();
    //below needs to run as cron job
    const currentBlockNumber =
      await this.appService.getCurrentBlockNumberOnEthMainnnet();
    this.tokenDistributorContract =
      this.appService.getTokenDistributionContract();
    console.log('Current eth block number ' + currentBlockNumber);
    console.log('Claim start eth block number ' + this.claimPeriodBlockStartNumber);
    console.log(currentBlockNumber > this.claimPeriodBlockStartNumber);
    console.log(currentBlockNumber < this.claimPeriodBlockStartNumber);
    // await this.appService.claimArbTokens(this.tokenDistributorContract);
    if (currentBlockNumber === this.claimPeriodBlockStartNumber) {
      await this.appService.claimArbTokens(this.tokenDistributorContract);
    }
  }
}
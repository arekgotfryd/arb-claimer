import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { Contract, JsonRpcProvider, toNumber, Wallet } from 'ethers';
import { abi, TokenDistributor } from './TokenDistributor';

@Injectable()
export class AppService {
  arbitrumprovider: JsonRpcProvider;
  ethprovider: JsonRpcProvider;
  contractAddress: string;
  tokenDistributorContract: TokenDistributor;
  claimPeriodBlockStartNumber: number;
  cronJob: any;

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  async init() {
    //providers
    this.arbitrumprovider = new JsonRpcProvider(process.env.ARBITRUM_RPC);
    this.ethprovider = new JsonRpcProvider(process.env.INFURA_RPC);
    this.contractAddress = '0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9'; // insert contract address here
    this.tokenDistributorContract = new Contract(
      this.contractAddress,
      abi,
      this.arbitrumprovider,
    ) as TokenDistributor;
    //bigint
    const claimPeriodBlockStart =
      await this.tokenDistributorContract.claimPeriodStart();
    //number
    this.claimPeriodBlockStartNumber = toNumber(claimPeriodBlockStart);
  }

  startCronJob() {
    this.cronJob = this.schedulerRegistry.getCronJob('cronjob');
    return this.cronJob;
  }

  async getCurrentBlockNumberOnEthMainnnet() {
    const blockNumber = await this.ethprovider.getBlockNumber();
    return blockNumber;
  }

  async claimArbTokens(contract: TokenDistributor) {
    const wallet = new Wallet(process.env.PRIVATE_KEY, this.arbitrumprovider);
    const walletContract = contract.connect(wallet) as TokenDistributor;
    try {
      const result = await walletContract.claim();
      console.log(result);
    } catch (err) {
      console.log(err);
      this.cronJob.stop();
      process.exit(0);
    } finally {
      this.cronJob.stop();
      process.exit(0);
    }
  }

  @Cron('*/2 * * * * *', {
    name: 'cronjob',
  })
  async runCronJob() {
    console.log('runs every 2 seconds');
    const currentBlockNumber = await this.getCurrentBlockNumberOnEthMainnnet();
    console.log('Current eth block number ' + currentBlockNumber);
    console.log(
      'Claim start eth block number ' + this.claimPeriodBlockStartNumber,
    );
    console.log(currentBlockNumber > this.claimPeriodBlockStartNumber);
    console.log(currentBlockNumber < this.claimPeriodBlockStartNumber);
    // await this.appService.claimArbTokens(this.tokenDistributorContract);
    // if (16890400 === this.claimPeriodBlockStartNumber) {
    if (currentBlockNumber === this.claimPeriodBlockStartNumber) {
      await this.claimArbTokens(this.tokenDistributorContract);
      process.exit(0);
    }
  }
}

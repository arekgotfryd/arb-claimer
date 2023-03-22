import { Injectable } from '@nestjs/common';
import { Contract, JsonRpcProvider, toNumber, Wallet } from 'ethers';
import { abi, TokenDistributor } from './TokenDistributor';

@Injectable()
export class AppService {
  arbitrumprovider: JsonRpcProvider;
  ethprovider: JsonRpcProvider;
  contractAddress: string;
  tokenDistributorContract: TokenDistributor;
  claimPeriodBlockStartNumber: number;
  async init() {
    //providers
    this.arbitrumprovider = new JsonRpcProvider(
      process.env.ARBITRUM_RPC,
    );
    this.ethprovider  = new JsonRpcProvider(
      process.env.INFURA_RPC,
    );
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

  getClaimPeriodBlockStartNumber = () => {
    return this.claimPeriodBlockStartNumber;
  }

  getTokenDistributionContract():TokenDistributor {
    return this.tokenDistributorContract;
  }

  async getCurrentBlockNumberOnEthMainnnet() {
    const blockNumber = await this.ethprovider.getBlockNumber();
    return blockNumber
  }

  async claimArbTokens(contract: TokenDistributor){
    const wallet = new Wallet(process.env.PRIVATE_KEY, this.arbitrumprovider);
    const walletContract = contract.connect(wallet) as TokenDistributor;
    const result = await walletContract.claim()
    console.log(result);
  }
}

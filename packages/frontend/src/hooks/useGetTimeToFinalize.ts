import { useWithdrawalMessage } from "@/hooks/useWithdrawalMessage";
import { useQuery } from "@tanstack/react-query";
import { Chain, Hash } from "viem";
import { publicActionsL1 } from "viem/op-stack";
import { useTransactionReceipt } from "wagmi";
import { usePublicClient } from "wagmi";

export const useGetTimeToFinalize = ({
  transactionHash,
  l2Chain,
}: {
  transactionHash: Hash;
  l2Chain: Chain;
}) => {
  const { data: receipt } = useTransactionReceipt({
    hash: transactionHash,
    chainId: l2Chain.id,
  });

  const l1PublicClient = usePublicClient({ chainId: l2Chain.sourceId! });

  const withdrawal = useWithdrawalMessage(receipt);

  return useQuery({
    enabled: !!receipt && !!l1PublicClient,
    queryKey: ["get-time-to-finalize", l2Chain.id, transactionHash],
    queryFn: async () => {
      if (!receipt || !l1PublicClient || !withdrawal) return;

      return await l1PublicClient.extend(publicActionsL1()).getTimeToFinalize({
        withdrawalHash: withdrawal.withdrawalHash,
        targetChain: l2Chain,
      });
    },
    refetchInterval: 5 * 1000,
  });
};

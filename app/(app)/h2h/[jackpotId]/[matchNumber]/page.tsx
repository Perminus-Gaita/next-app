import H2HClient from '../../client';

interface H2HPageProps {
  params: Promise<{
    jackpotId: string;
    matchNumber: string;
  }>;
}

export default async function H2HMatchPage({ params }: H2HPageProps) {
  const { jackpotId, matchNumber } = await params;

  return (
    <H2HClient
      jackpotId={jackpotId}
      matchNumber={parseInt(matchNumber, 10)}
    />
  );
}

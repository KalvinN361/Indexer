export interface FailedAsset {
	id: string | null;
	incorrectOwner: string | null;
	correctOwner: string | null;
	corrected: boolean;
}
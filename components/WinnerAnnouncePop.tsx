
type WinnerAnnouncePopProps = {
    winner: 'black' | 'white' | 'draw';
    onDismiss: () => void;
};

// 勝者が決定した時に表示させるコンポーネント
const WinnerAnnouncePop = ({ winner, onDismiss }: WinnerAnnouncePopProps) => {
    const winnerText = winner === 'draw' ? '引き分け！' : `${winner.toUpperCase()} の勝利！`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={onDismiss}>
            <div className=" bg-white p-10 rounded-lg shadow-xl text-3xl">
            {winnerText}
            </div>
        </div>
    );
};

export default WinnerAnnouncePop;
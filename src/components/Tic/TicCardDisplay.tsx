import { Modal } from "@/components/Modal";
import { PlayabilityResult } from "@/lib/tic/types/PlayabilityResult";
import { TicCard } from "@/lib/tic/types/TicCard";
import { faBolt, faBrain, faCheck, faHandHoldingMedical, faQuestion, faRotateLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FunctionComponent, h } from "preact";
import { useContext, useState } from "preact/hooks";
import { useTranslation } from "react-i18next";
import { GameManagerContext } from "@/components/Tic/TicGame";


type Props = {
  card: TicCard;
  selected: boolean;
};

type CardProps = {
  value: number;
};

type HelpModalProps = {
  reasons: string[];
  card: TicCard;
};

const CardComponents: { [key in TicCard['type']]: FunctionComponent<CardProps> } = {
  number: NumberCardContent,
  split: SplitCardContent,
  enter: EnterCardContent,
  backwards: BackwardsCardContent,
  skip: SkipCardContent,
  first_aid: FirstAidCardContent,
  mindcontrol: MindcontrolCardContent,
  dash_attack: DashAttackCardContent,
  rotate: RotateCardContent,
  swap: SwapCardContent,
  undo: UndoCardContent
};

const CardCSSClassList: { [key in TicCard['type']]: string[] } = {
  number: ["tic-number"],
  split: ["tic-card-special"],
  enter: ["tic-card-special"],
  backwards: ["tic-card-special"],
  skip: ["tic-card-special"],
  first_aid: ["tic-card-icon"],
  mindcontrol: ["tic-card-icon"],
  dash_attack: ["tic-card-icon"],
  rotate: ["tic-card-icon"],
  swap: ["tic-card-text"],
  undo: ["tic-card-text"]
};

export function TicCardDisplay({ card, selected }: Props) {

  const [GameState, gameManagerAction] = useContext(GameManagerContext);

  const playability: PlayabilityResult = GameState?.playability && GameState?.board?.center?.id != card.id ? GameState.playability[card.id] : { playable: false, reasons: [''] };

  const CardComponent = CardComponents[card.type];
  const cardsActive = GameState?.cardsActive;

  return <div
    onClick={() => {
      if (!gameManagerAction) return;
      if (!cardsActive) return;
      if (!playability.playable) return;
      gameManagerAction({
        action: 'select-card',
        data: card
      });
    }}
    className={[
      "tic-card",
      ...CardCSSClassList[card.type],
      selected ? 'tic-card-selected' : '',
      (GameState?.board?.center?.id == card.id || playability.playable) && cardsActive ? '' : 'tic-card-unplayable'
    ].join(' ')}>
    <HelpModal card={card} reasons={playability.playable ? [] : playability.reasons}></HelpModal>
    {
      selected ?
        <div className="tic-confirm-card">
          <span
            onClick={async () => {
              if (!gameManagerAction) throw new Error("No HandManager instance");
              gameManagerAction({
                action: 'play-card',
                data: card
              });
            }}
            className="option-confirm">
            <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
          </span>
          <span
            onClick={(e) => {
              if (!gameManagerAction) throw new Error("No HandManager instance");
              gameManagerAction({
                action: 'select-card',
                data: null
              });
              e.stopPropagation();
            }}
            className="option-reject">
            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
          </span>
        </div>
        :
        <CardComponent value={card.value ?? -1}></CardComponent>
    }
  </div>;
}

function HelpModal({ reasons, card }: HelpModalProps) {
  const [open, setOpen] = useState(false);

  const [GameState] = useContext(GameManagerContext);
  const { t } = useTranslation();

  return <div
    onClick={(e) => {
      setOpen(true);
      e.stopPropagation();
    }}
    className="tic-help-btn">
    <FontAwesomeIcon icon={faQuestion}></FontAwesomeIcon>
    <Modal open={open} onClose={() => setOpen(false)}>
      {
        (!reasons.length || GameState?.board?.center?.id == card.id) || <div>{t("You can not play this card for the following reasons")}: <br />
          {
            reasons.map((s, i) => <div key={i}>{t(s, { value: card.value })}</div>)
          }
        </div>
      }
      <button
        onClick={() => setOpen(false)}
      >{t('Close')}</button>
    </Modal>
  </div>;
}


function NumberCardContent({ value }: CardProps) {
  return <span>{value}</span>;
}

function SplitCardContent({ value }: CardProps) {
  return <span>{value}</span>;
}

function EnterCardContent({ value }: CardProps) {
  return <span>{value}</span>;
}

function BackwardsCardContent({ value }: CardProps) {
  return <span>{value}</span>;
}

function SkipCardContent({ value }: CardProps) {
  return <span>{value}</span>;
}

function SwapCardContent({ value }: CardProps) {
  return <span>SWAP</span>;
}

function UndoCardContent({ value }: CardProps) {
  return <span>UNDO</span>;
}

function FirstAidCardContent({ value }: CardProps) {
  return <FontAwesomeIcon icon={faHandHoldingMedical}></FontAwesomeIcon>;
}

function MindcontrolCardContent({ value }: CardProps) {
  return <FontAwesomeIcon icon={faBrain}></FontAwesomeIcon>;
}

function DashAttackCardContent({ value }: CardProps) {
  return <FontAwesomeIcon icon={faBolt}></FontAwesomeIcon>;
}

function RotateCardContent({ value }: CardProps) {
  return <FontAwesomeIcon icon={faRotateLeft}></FontAwesomeIcon>;
}

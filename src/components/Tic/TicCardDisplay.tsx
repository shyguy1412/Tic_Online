import { Modal } from "@/components/Modal";
import { HandContext } from "@/components/Tic/TicHand";
import { PlayabilityResult } from "@/lib/tic/types/PlayabilityResult";
import { TicCard } from "@/lib/tic/types/TicCard";
import { TicGameStateContext } from "@/pages/room/{roomID}";
import { faBolt, faBrain, faCheck, faHandHoldingMedical, faQuestion, faRotateLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FunctionComponent, h } from "preact";
import { useContext, useState } from "preact/hooks";
import { useTranslation } from "react-i18next";

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

  const game = useContext(TicGameStateContext);
  const [_, handManagerAction] = useContext(HandContext) ?? [];

  const playability: PlayabilityResult = game?.playability ? game.playability[card.id] : { playable: false, reasons: [''] };

  const CardComponent = CardComponents[card.type];

  return <div
    onClick={() => {
      if (!handManagerAction) return;
      if (!playability.playable) return;
      handManagerAction({
        action: 'select-card',
        data: card
      });
    }}
    className={[
      "tic-card",
      ...CardCSSClassList[card.type],
      selected ? 'tic-card-selected' : '',
      playability.playable ? '' : 'tic-card-unplayable'
    ].join(' ')}>
    <HelpModal card={card} reasons={playability.playable ? [] : playability.reasons}></HelpModal>
    {
      selected ?
        <div className="tic-confirm-card">
          <span
            onClick={() => {
              if (!handManagerAction) throw new Error("No HandManager instance");
              handManagerAction({
                action: 'play-card',
                data: card
              });
            }}
            className="option-confirm">
            <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
          </span>
          <span
            onClick={(e) => {
              if (!handManagerAction) throw new Error("No HandManager instance");
              handManagerAction({
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

  const { t, i18n } = useTranslation();

  return <div
    onClick={(e) => {
      setOpen(true);
      e.stopPropagation();
    }}
    className="tic-help-btn">
    <FontAwesomeIcon icon={faQuestion}></FontAwesomeIcon>
    <Modal open={open} onClose={() => setOpen(false)}>
      {
        !reasons.length || <div>{t("You can not play this card for the following reasons")}: <br />
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

import "./PartitionRwFilter.css";
import type { FC } from "react";
import { Button, Form } from "react-bootstrap";

interface Props {
  rwFrom: number;
  rwTo: number;
  rwMin: number;
  rwMax: number;
  setRwFrom: (value: number) => void;
  setRwTo: (value: number) => void;
  onSubmit: () => void;
  buttonTitle?: string;
  loading?: boolean; // идёт запрос — кнопка недоступна
}

// Фильтр плитки по индексу звукоизоляции Rw (слайдеры «не ниже» и «не выше», как в ЛР-2)
export const PartitionRwFilter: FC<Props> = ({
  rwFrom,
  rwTo,
  rwMin,
  rwMax,
  setRwFrom,
  setRwTo,
  onSubmit,
  buttonTitle = "Поиск",
  loading = false,
}) => (
  <Form
    className="partitionFilterForm"
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <div className="partitionFilterRow">
      <span className="partitionFilterLabel">Индекс Rw не ниже</span>
      <span className="partitionFilterLabel">{rwFrom} дБ</span>
    </div>
    <Form.Range
      bsPrefix="partitionSlider"
      min={rwMin}
      max={rwMax}
      step={1}
      value={rwFrom}
      onChange={(event) => setRwFrom(Number(event.target.value))}
    />

    <div className="partitionFilterRow partitionFilterRowSecond">
      <span className="partitionFilterLabel">Индекс Rw не выше</span>
      <span className="partitionFilterLabel">{rwTo} дБ</span>
    </div>
    <Form.Range
      bsPrefix="partitionSlider"
      min={rwMin}
      max={rwMax}
      step={1}
      value={rwTo}
      onChange={(event) => setRwTo(Number(event.target.value))}
    />

    <div className="partitionFilterRow partitionFilterBounds">
      <span>{rwMin}</span>
      <span>{rwMax}</span>
    </div>

    <Button type="submit" className="partitionPrimaryButton" disabled={loading}>
      {buttonTitle}
    </Button>
  </Form>
);

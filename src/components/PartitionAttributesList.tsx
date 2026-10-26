import "./PartitionAttributesList.css";
import type { FC } from "react";
import { ListGroup } from "react-bootstrap";
import type { PartitionSystemAttribute } from "../modules/partitionTypes";

interface Props {
  partitionAttributes: PartitionSystemAttribute[];
}

// Дополнительные характеристики конструкции: наименование, значение и единица измерения
export const PartitionAttributesList: FC<Props> = ({ partitionAttributes }) => (
  <div className="partitionAttributes">
    <div className="partitionAttributesTitle">Характеристики</div>
    {!partitionAttributes.length ? (
      <div className="partitionAttributesEmpty">Дополнительные характеристики не указаны</div>
    ) : (
      <ListGroup variant="flush" className="partitionAttributesList">
        {partitionAttributes.map((partitionAttribute) => (
          <ListGroup.Item key={partitionAttribute.partitionAttributeId} className="partitionAttributesItem">
            <span className="partitionAttributesName">{partitionAttribute.partitionAttributeName}</span>
            <span className="partitionAttributesValue">
              {partitionAttribute.partitionAttributeValue}
              {partitionAttribute.partitionAttributeUnit && ` ${partitionAttribute.partitionAttributeUnit}`}
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    )}
  </div>
);

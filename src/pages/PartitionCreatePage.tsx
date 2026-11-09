import "./PartitionCreatePage.css";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FC, FormEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../Routes";
import type { AppDispatch } from "../store";
import { usePartitionIsAuthenticated } from "../slices/partitionUserSlice";
import {
  createPartitionDraft,
  getPartitionAttributesDirectory,
  getPartitionDraft,
  publishPartitionDraft,
  usePartitionAttributesDirectory,
  usePartitionCreateError,
  usePartitionCreateLoading,
  usePartitionDraft,
} from "../slices/partitionCreateSlice";
import { PARTITION_DEFAULT_PHOTO, PARTITION_DEFAULT_VIDEO } from "../modules/partitionDefaults";

// Страница «Добавить конструкцию» — как в ЛР-2 (views/partition-create.hbs):
// черновика нет — выбор фото и видео, название и «Далее» (POST /api/partitions/draft);
// черновик есть — его название, фото и видео, описание, технические параметры
// и «Опубликовать» (PUT /api/partitions/draft/publish)
export const PartitionCreatePage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isAuthenticated = usePartitionIsAuthenticated();
  const partitionAttributesDirectory = usePartitionAttributesDirectory();
  const partitionDraft = usePartitionDraft();
  const loading = usePartitionCreateLoading();
  const error = usePartitionCreateError();

  const [partitionName, setPartitionName] = useState("");
  const [partitionPhoto, setPartitionPhoto] = useState<File | null>(null);
  const [partitionVideo, setPartitionVideo] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    partitionDescription: "",
    partitionThicknessMm: "",
    soundIndexRw: "",
  });
  const [attributeValues, setAttributeValues] = useState<Record<number, string>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  // при открытии страницы — черновик пользователя и справочник характеристик
  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(getPartitionDraft());
    dispatch(getPartitionAttributesDirectory());
  }, [dispatch, isAuthenticated]);

  // превью выбранных файлов (временные ссылки на файлы в браузере, освобождаются при замене)
  const photoPreviewUrl = useMemo(() => (partitionPhoto ? URL.createObjectURL(partitionPhoto) : null), [partitionPhoto]);
  const videoPreviewUrl = useMemo(() => (partitionVideo ? URL.createObjectURL(partitionVideo) : null), [partitionVideo]);
  useEffect(() => () => {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
  }, [photoPreviewUrl]);
  useEffect(() => () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
  }, [videoPreviewUrl]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // «Далее»: черновик с названием, фото и видео — страница показывает поля публикации
  const handleNext = async (event: FormEvent) => {
    event.preventDefault();
    const name = partitionName.trim();
    const message = !name || name.length > 100
      ? "Название конструкции: от 1 до 100 символов"
      : !partitionPhoto
        ? "Выберите фото перегородки"
        : !partitionVideo
          ? "Выберите видео перегородки"
          : null;
    setValidationError(message);
    if (message || !partitionPhoto || !partitionVideo) return;
    try {
      await dispatch(createPartitionDraft({ partitionName: name, partitionPhoto, partitionVideo })).unwrap();
    } catch {
      // текст ошибки уже в Redux (partitionCreate.error)
    }
  };

  // «Опубликовать»: публикация черновика и переход к нему в ленте
  const handlePublish = async (event: FormEvent) => {
    event.preventDefault();
    const partitionDescription = formData.partitionDescription.trim();
    const partitionThicknessMm = Number(formData.partitionThicknessMm);
    const soundIndexRw = Number(formData.soundIndexRw);
    const message = !partitionDescription || partitionDescription.length > 500
      ? "Описание: от 1 до 500 символов"
      : !Number.isInteger(partitionThicknessMm) || partitionThicknessMm < 1 || partitionThicknessMm > 1000
        ? "Толщина — целое число от 1 до 1000 мм"
        : formData.soundIndexRw === "" || !Number.isInteger(soundIndexRw) || soundIndexRw < 0 || soundIndexRw > 100
          ? "Индекс Rw — целое число от 0 до 100 дБ"
          : null;
    setValidationError(message);
    if (message) return;
    try {
      const publishedPartitionSystem = await dispatch(
        publishPartitionDraft({
          partitionDescription,
          partitionThicknessMm,
          soundIndexRw,
          // пустые характеристики не отправляем
          partitionAttributes: Object.entries(attributeValues)
            .filter(([, value]) => value.trim())
            .map(([partitionAttributeId, value]) => ({
              partitionAttributeId: Number(partitionAttributeId),
              partitionAttributeValue: value.trim(),
            })),
        }),
      ).unwrap();
      navigate(`${ROUTES.PARTITION_FEED}/${publishedPartitionSystem.partitionSystemId}`);
    } catch {
      // текст ошибки уже в Redux (partitionCreate.error)
    }
  };

  const shownError = validationError ?? error;

  return (
    <>
      <header className="partitionHeader partitionHeaderRow">
        <h1 className="partitionHeaderTitle">Добавить конструкцию</h1>
        <span className="partitionDraftBadge">Черновик</span>
      </header>

      <section className="partitionCreate">
        {!isAuthenticated ? (
          <>
            <p className="partitionFieldLabel">Добавлять конструкции может только пользователь после входа.</p>
            <Button type="button" className="partitionPrimaryButton" onClick={() => navigate(ROUTES.PARTITION_LOGIN)}>
              Войти
            </Button>
          </>
        ) : partitionDraft ? (
          // Черновик уже создан: фото и видео только показываются, вводятся поля для публикации
          <Form onSubmit={handlePublish} noValidate>
            {shownError && <Alert variant="danger" className="partitionCreateAlert">{shownError}</Alert>}
            <p className="partitionDraftName">{partitionDraft.partitionName}</p>

            <div className="partitionUploadStack">
              <div className="partitionUploadCell">
                <img
                  className="partitionUploadMedia"
                  src={partitionDraft.partitionPhotoUrl || PARTITION_DEFAULT_PHOTO}
                  alt={partitionDraft.partitionName}
                  onError={(event) => {
                    if (!event.currentTarget.src.endsWith(PARTITION_DEFAULT_PHOTO)) {
                      event.currentTarget.src = PARTITION_DEFAULT_PHOTO;
                    }
                  }}
                />
                <span className="partitionUploadCaption">Фото перегородки</span>
              </div>
              <div className="partitionUploadCell">
                <video
                  className="partitionUploadMedia"
                  src={partitionDraft.partitionVideoUrl || PARTITION_DEFAULT_VIDEO}
                  poster={partitionDraft.partitionPhotoUrl || PARTITION_DEFAULT_PHOTO}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onError={(event) => {
                    if (!event.currentTarget.src.endsWith(PARTITION_DEFAULT_VIDEO)) {
                      event.currentTarget.src = PARTITION_DEFAULT_VIDEO;
                    }
                  }}
                />
                <span className="partitionUploadCaption">Видео перегородки</span>
              </div>
            </div>

            <p className="partitionFieldLabel">Описание</p>
            <Form.Control
              as="textarea"
              className="partitionField partitionFieldArea"
              name="partitionDescription"
              value={formData.partitionDescription}
              onChange={handleChange}
              maxLength={500}
              disabled={loading}
            />

            <p className="partitionSectionTitle">Технические параметры</p>

            <div className="partitionParamRow">
              <div className="partitionParamCell">
                <p className="partitionFieldLabel">Толщина, мм</p>
                <Form.Control
                  className="partitionField"
                  type="number"
                  name="partitionThicknessMm"
                  value={formData.partitionThicknessMm}
                  onChange={handleChange}
                  min={1}
                  max={1000}
                  disabled={loading}
                />
              </div>
              <div className="partitionParamCell">
                <p className="partitionFieldLabel">Индекс Rw, дБ</p>
                <Form.Control
                  className="partitionField"
                  type="number"
                  name="soundIndexRw"
                  value={formData.soundIndexRw}
                  onChange={handleChange}
                  min={0}
                  max={100}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Характеристики из справочника GET /api/partitions/attributes (необязательные) */}
            {partitionAttributesDirectory.map((partitionAttribute) => (
              <div key={partitionAttribute.partitionAttributeId}>
                <p className="partitionFieldLabel">
                  {partitionAttribute.partitionAttributeName}
                  {partitionAttribute.partitionAttributeUnit && `, ${partitionAttribute.partitionAttributeUnit}`}
                </p>
                <Form.Control
                  className="partitionField"
                  value={attributeValues[partitionAttribute.partitionAttributeId] ?? ""}
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setAttributeValues({ ...attributeValues, [partitionAttribute.partitionAttributeId]: event.target.value })
                  }
                  maxLength={255}
                  disabled={loading}
                />
              </div>
            ))}

            <Button type="submit" className="partitionPrimaryButton" disabled={loading}>
              Опубликовать
            </Button>
          </Form>
        ) : (
          // Черновика нет: выбор фото и видео через проводник, название, кнопка «Далее»
          <Form onSubmit={handleNext} noValidate>
            {shownError && <Alert variant="danger" className="partitionCreateAlert">{shownError}</Alert>}
            <div className="partitionUploadStack">
              <div className="partitionUploadBlock">
                <div className="partitionUploadCell">
                  <img
                    className="partitionUploadMedia"
                    src={photoPreviewUrl ?? PARTITION_DEFAULT_PHOTO}
                    alt="Фото перегородки"
                  />
                  <span className="partitionUploadCaption">Фото перегородки</span>
                </div>
                <label className="partitionPickButton">
                  <span>{partitionPhoto?.name ?? "Выбрать фото"}</span>
                  <input
                    className="partitionPickInput"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setPartitionPhoto(event.target.files?.[0] ?? null)}
                    disabled={loading}
                  />
                </label>
              </div>

              <div className="partitionUploadBlock">
                <div className="partitionUploadCell">
                  <video
                    className="partitionUploadMedia"
                    src={videoPreviewUrl ?? PARTITION_DEFAULT_VIDEO}
                    poster={videoPreviewUrl ? undefined : PARTITION_DEFAULT_PHOTO}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  />
                  <span className="partitionUploadCaption">Видео перегородки</span>
                </div>
                <label className="partitionPickButton">
                  <span>{partitionVideo?.name ?? "Выбрать видео"}</span>
                  <input
                    className="partitionPickInput"
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setPartitionVideo(event.target.files?.[0] ?? null)}
                    disabled={loading}
                  />
                </label>
              </div>
            </div>

            <p className="partitionFieldLabel">Название конструкции</p>
            <Form.Control
              className="partitionField"
              type="text"
              name="partitionName"
              value={partitionName}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setPartitionName(event.target.value)}
              maxLength={100}
              disabled={loading}
            />

            <Button type="submit" className="partitionPrimaryButton" disabled={loading}>
              Далее
            </Button>
          </Form>
        )}
      </section>
    </>
  );
};

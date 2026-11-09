import "./PartitionLoginPage.css";
import { useEffect, useState } from "react";
import type { ChangeEvent, FC, FormEvent } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../Routes";
import type { AppDispatch } from "../store";
import { loginPartitionUser } from "../modules/partitionAuth";
import {
  setPartitionUserAction,
  setPartitionUserErrorAction,
  usePartitionUserError,
} from "../slices/partitionUserSlice";

// Страница «Вход»: логин и пароль пользователя веб-сервиса.
// Запрос — axios (без thunk), результат вручную передаётся в Redux
export const PartitionLoginPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const error = usePartitionUserError();
  const [formData, setFormData] = useState({ partitionUserLogin: "", partitionUserPassword: "" });
  const [loading, setLoading] = useState(false);

  // при открытии страницы убираем сообщение о прошлой неудачной попытке
  useEffect(() => {
    dispatch(setPartitionUserErrorAction(null));
  }, [dispatch]);

  // изменение полей ввода (логин и пароль)
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // нажатие «Войти»: запрос axios, затем состояние пользователя в Redux и переход в плитку
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!formData.partitionUserLogin || !formData.partitionUserPassword) {
      dispatch(setPartitionUserErrorAction("Введите логин и пароль"));
      return;
    }
    setLoading(true);
    try {
      const partitionUser = await loginPartitionUser(formData.partitionUserLogin, formData.partitionUserPassword);
      dispatch(setPartitionUserAction(partitionUser));
      navigate(ROUTES.PARTITION_TILES);
    } catch {
      dispatch(setPartitionUserErrorAction("Неверный логин или пароль либо веб-сервис недоступен"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="partitionHeader">
        <h1 className="partitionHeaderTitle">Вход</h1>
      </header>

      <section className="partitionLogin">
        <p className="partitionLoginText">
          После входа можно добавлять конструкции, ставить лайки и удалять свои конструкции.
        </p>
        {error && <Alert variant="danger" className="partitionLoginAlert">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="partitionUserLogin">
            <Form.Label className="partitionLoginLabel">Логин</Form.Label>
            <Form.Control
              className="partitionLoginInput"
              type="text"
              name="partitionUserLogin"
              value={formData.partitionUserLogin}
              onChange={handleChange}
              placeholder="Введите логин"
              autoComplete="username"
              disabled={loading}
            />
          </Form.Group>
          <Form.Group controlId="partitionUserPassword">
            <Form.Label className="partitionLoginLabel">Пароль</Form.Label>
            <Form.Control
              className="partitionLoginInput"
              type="password"
              name="partitionUserPassword"
              value={formData.partitionUserPassword}
              onChange={handleChange}
              placeholder="Введите пароль"
              autoComplete="current-password"
              disabled={loading}
            />
          </Form.Group>
          <Button type="submit" className="partitionPrimaryButton" disabled={loading}>
            {loading && <Spinner animation="border" className="partitionLoginSpinner" />}
            Войти
          </Button>
        </Form>
      </section>
    </>
  );
};

import { resolve } from 'path';

import { generateApi } from 'swagger-typescript-api';

// Кодогенерация клиента веб-сервиса по спецификации Swagger (OpenAPI) бэкенда.
// Бэкенд должен быть запущен: NestJS отдаёт спецификацию по адресу /api-json
generateApi({
    name: 'Api.ts',
    output: resolve(process.cwd(), './src/api'),
    url: 'http://localhost:8080/api-json',
    httpClientType: 'axios',
    // модули по тегам Swagger: api.partitions.* и api.partitionUsers.*
    moduleNameFirstTag: true,
});

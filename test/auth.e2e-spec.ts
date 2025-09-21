import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
import request from 'supertest';

import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { get } from 'http';

describe('Authentication system', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handle signup request ', () => {
    const email = '1234q56@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123456' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signup and get the currently logged in user', async () => {
    const email = 'test@test.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '123' })
      .expect(201);

    const cookie = res.get('Set-Cookie');
    expect(cookie).toBeDefined();
    if (!cookie) throw new Error('No cookie was set');
    const whoAmIRes = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie[0]);

    expect(whoAmIRes.body.email).toEqual(email);
  });
});

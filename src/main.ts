import express from 'express';
import { squid } from 'squid-ssr';
import pages from 'squid-ssr/pages';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { connectToDatabase } from '@/lib/mongoose';

const port = Number.parseInt(process.env.SQUID_PORT ?? '0') || 3000;
const app = express();

connectToDatabase()

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

app.use(cookieParser());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ type: 'application/x-www-form-urlencoded', 'extended': true }));

app.use(squid(pages));

app.get('*', (_req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`✅ Express server listening on port ${port}`);
});

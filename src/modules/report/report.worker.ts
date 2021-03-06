import axios from 'axios';
import { Subscription, timer } from 'rxjs';
import { retry, concatMap } from 'rxjs/operators';

const [nodeRoute, scriptRoute, url, delay, retryAttempts] = process.argv;

export interface ReportResponse {
  ip: string;
  country_code: string;
  country_name: string;
  region_code: string;
}

const request: Subscription = timer(parseFloat(delay) || 0)
  .pipe(
    concatMap(() => axios.get<ReportResponse>(url)),
    retry(parseFloat(retryAttempts) || 0),
  )
  .subscribe(
    result => {
      process.send(result.data);
      request.unsubscribe();
      process.exit();
    },
    err => {
      request.unsubscribe();
      process.exit(1);
    },
  );

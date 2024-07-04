import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1m', target: 20 }, // Simula ramp-up de usuarios a 20 durante 1 minuto
        { duration: '2m', target: 20 }, // Mantiene 20 usuarios por 2 minutos
        { duration: '1m', target: 0 }, // Simula ramp-down de usuarios a 0 durante 1 minuto
    ],
};

export default function () {
    let res = http.get('http://10.104.200.145:80');
    check(res, { 'is status 200': (r) => r.status === 200 });
    sleep(1);
}

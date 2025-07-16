"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RmqModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingModule = exports.RmqModule = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let RmqModule = RmqModule_1 = class RmqModule {
    static register(options) {
        const clientOptions = {
            name: options.name,
            transport: microservices_1.Transport.RMQ,
            options: {
                urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                queue: options.queue,
                exchange: options.exchange,
                exchangeType: options.exchangeType || 'direct',
                routingKey: options.routingKey || options.queue,
                queueOptions: {
                    durable: true,
                    ...options.queueOptions,
                },
            },
        };
        return {
            module: RmqModule_1,
            imports: [microservices_1.ClientsModule.register([clientOptions])],
            exports: [microservices_1.ClientsModule],
        };
    }
};
RmqModule = RmqModule_1 = __decorate([
    (0, common_1.Module)({})
], RmqModule);
exports.RmqModule = RmqModule;
let MessagingModule = class MessagingModule {
};
MessagingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            RmqModule.register({
                name: 'TASK_EVENTS',
                queue: 'task.events',
                exchange: 'task.events',
                exchangeType: 'topic',
            }),
            RmqModule.register({
                name: 'EMAIL_NOTIFICATIONS',
                queue: 'notification.email',
                exchange: 'notification',
                exchangeType: 'direct',
                queueOptions: {
                    deadLetterExchange: 'notification.dlx',
                    deadLetterRoutingKey: 'email.failed',
                },
            }),
        ],
    })
], MessagingModule);
exports.MessagingModule = MessagingModule;

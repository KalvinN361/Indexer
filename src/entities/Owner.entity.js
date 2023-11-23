"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerEntity = void 0;
const typeorm_1 = require("typeorm");
const index_1 = require("./index");
let OwnerEntity = class OwnerEntity extends index_1.BaseEntity {
};
exports.OwnerEntity = OwnerEntity;
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 64 }),
    __metadata("design:type", String)
], OwnerEntity.prototype, "walletAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 128 }),
    __metadata("design:type", String)
], OwnerEntity.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 128 }),
    __metadata("design:type", String)
], OwnerEntity.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 128 }),
    __metadata("design:type", String)
], OwnerEntity.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 128 }),
    __metadata("design:type", String)
], OwnerEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ enum: [1, 5, 137, 8001], default: 1 }),
    __metadata("design:type", Number)
], OwnerEntity.prototype, "chainId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, length: 32 }),
    __metadata("design:type", String)
], OwnerEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, length: 32 }),
    __metadata("design:type", String)
], OwnerEntity.prototype, "role", void 0);
exports.OwnerEntity = OwnerEntity = __decorate([
    (0, typeorm_1.Index)('idx_walletaddress', ['walletAddress'], {
        unique: true,
    }),
    (0, typeorm_1.Entity)('Owners', { schema: 'public' })
], OwnerEntity);
//# sourceMappingURL=Owner.entity.js.map
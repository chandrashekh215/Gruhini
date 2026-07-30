import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { prisma } from '../lib/prisma.js';

const PROTO_PATH = path.resolve(process.cwd(), 'src/main/proto/product.proto');

export function startGrpcServer(port = 50051) {
  try {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const proto = grpc.loadPackageDefinition(packageDefinition) as any;
    const server = new grpc.Server();

    const serviceDef = proto.ProductService || {
      GetProducts: {
        path: '/ProductService/GetProducts',
        requestStream: false,
        responseStream: false,
        requestSerialize: (arg: any) => Buffer.from(''),
        requestDeserialize: (buffer: Buffer) => ({}),
        responseSerialize: (arg: any) => Buffer.from(JSON.stringify(arg)),
        responseDeserialize: (buffer: Buffer) => JSON.parse(buffer.toString()),
      },
    };

    server.addService(serviceDef, {
      GetProducts: async (call: any, callback: any) => {
        try {
          const dbProducts = await prisma.product.findMany({
            where: { status: 'APPROVED' },
          });

          const products = dbProducts.map((p) => ({
            id: String(p.id),
            name: p.name,
            description: p.description || '',
            price: String(p.price),
            rating: p.rating || 4.5,
            verified: p.verified,
            badge: p.badge || '',
            category: p.category || 'THALI',
            subcategory: p.subcategory || '',
            stock: p.stock,
            image: p.image,
          }));

          callback(null, { products });
        } catch (err: any) {
          callback({
            code: grpc.status.INTERNAL,
            message: err.message,
          });
        }
      },
    });

    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
      if (err) {
        console.error('Failed to bind gRPC server:', err);
        return;
      }
      console.log(`🚀 gRPC Product Service running on port ${boundPort}`);
    });
  } catch (error) {
    console.warn('gRPC server initialization skipped or proto file not found:', error);
  }
}

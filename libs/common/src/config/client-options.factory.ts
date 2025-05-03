import { ClientProvider, ClientsProviderAsyncOptions, MicroserviceOptions, Transport } from "@nestjs/microservices";
import { ServiceDefinition } from "../interfaces/service-definition.interface";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";


/**
 * Generates NestJS MicroserviceOptions for bootstrapping a listener based on environment variables.
 *
 * This helper reads the transport type and connection options (host, port, urls, queue, etc.)
 * from the provided environment variables (`env`) using conventions defined in the `ServiceDefinition`
 * (specifically the `envPrefix`).
 *
 * It is primarily intended for use in the application's main bootstrap file (`main.ts`)
 * to configure the options for `NestFactory.createMicroservice()`, as it operates
 * before the full NestJS Dependency Injection container is initialized.
 *
 * @param definition - Metadata describing the service, including its token and environment variable prefix.
 * @param env - The environment variables object, typically `process.env`.
 * @returns A `MicroserviceOptions` object suitable for `NestFactory.createMicroservice`.
 * @throws {Error} If required environment variables (like port or URLs based on transport) are missing or invalid.
 */
export function createMicroserviceOptions(
    definition: ServiceDefinition, // Assuming ServiceDefinition is imported
    env: NodeJS.ProcessEnv,
): MicroserviceOptions { // Added return type annotation
    const logger = new Logger("CommonModule.createMicroserviceOptions");
    const prefix = definition.envPrefix;

    const transportStr = (env[`${prefix}_TRANSPORT`] || 'TCP').toUpperCase();
    const transport: Transport | undefined = Transport[transportStr as keyof typeof Transport];

    if (transport === undefined) {
        logger.error(`Unknown transport: ${transportStr}`);
        throw new Error(`Unknown transport: ${transportStr}`);
    }

    const options: Record<string, any> = {};

    // Build options based on transport type
    switch (transport) {
        case Transport.TCP:
            options.host = (env[`${prefix}_HOST`] || "0.0.0.0");
            options.port = parseInt(env[`${prefix}_PORT`] || "3001", 10);
            if (!options.port) throw new Error(`Missing ${prefix}_PORT for ${transportStr}`);
            break;
        // TODO (abdelaziz): Add more transport layers later

        default:
            logger.error(`Unknown transport: ${transportStr}`);
            throw new Error(`Unknown transport: ${transportStr}`);

    }
    if (!options.port && !options.urls) {
        logger.error(`Failed to configure client for ${definition.token}. Missing critical options.`);
        throw new Error(`Configuration error for microservice client: ${definition.token}`);
    }
    return { transport, options };
}

export function factoryOptions(
    configService: ConfigService,
    definition: ServiceDefinition,
): ClientProvider {
    const logger = new Logger("CommonModule.createClientsAsyncOptions");
    logger.log("env: ", process.env);
    const prefix = definition.envPrefix;

    const transportStr = configService.get<string>(`${prefix}_TRANSPORT`, 'TCP').toUpperCase();
    const transport: Transport | undefined = Transport[transportStr as keyof typeof Transport];
    if (transport === undefined) {
        logger.error(`Unknown transport: ${transportStr}`);
        throw new Error(`Unknown transport: ${transportStr}`);
    }

    const options: Record<string, any> = {};

    switch (transport) {
        case Transport.TCP:
            options.host = configService.get<string>(`${prefix}_HOST`, "localhost");
            options.port = configService.get<number>(`${prefix}_PORT`);
            logger.log(configService.get<number>(`${prefix}_PORT`));
            if (!options.port) throw new Error(`Missing ${prefix}_PORT for ${transportStr}`);
            break;
        // TODO (abdelaziz): Add more tranport layers later

        default:
            logger.error(`Unknown transport: ${transportStr}`);
            throw new Error(`Unknown transport: ${transportStr}`);

    }
    if (!options.port && !options.urls) {
        logger.error(`Failed to configure client for ${definition.token}. Missing critical options.`);
        throw new Error(`Configuration error for microservice client: ${definition.token}`);
    }
    return { transport, options };

}

export function createClientsAsyncOptions(
    definition: ServiceDefinition,
): ClientsProviderAsyncOptions {
    return {
        name: definition.token,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
            const logger = new Logger("CommonModule.createClientsAsyncOptions");
            const prefix = definition.envPrefix;

            const transportStr = configService.get<string>(`${prefix}_TRANSPORT`, 'TCP').toUpperCase();
            const transport: Transport | undefined = Transport[transportStr as keyof typeof Transport];
            if (transport === undefined) {
                logger.error(`Unknown transport: ${transportStr}`);
                throw new Error(`Unknown transport: ${transportStr}`);
            }

            const options: Record<string, any> = {};

            switch (transport) {
                case Transport.TCP:
                    options.host = configService.get<string>(`${prefix}_HOST`, "localhost");
                    options.port = configService.get<number>(`${prefix}_PORT`);
                    logger.log(configService.get<number>(`${prefix}_PORT`));
                    if (!options.port) throw new Error(`Missing ${prefix}_PORT for ${transportStr}`);
                    break;
                // TODO (abdelaziz): Add more tranport layers later

                default:
                    logger.error(`Unknown transport: ${transportStr}`);
                    throw new Error(`Unknown transport: ${transportStr}`);

            }
            if (!options.port && !options.urls) {
                logger.error(`Failed to configure client for ${definition.token}. Missing critical options.`);
                throw new Error(`Configuration error for microservice client: ${definition.token}`);
            }
            return { transport, options };
        },
        inject: [ConfigService],
    }
}

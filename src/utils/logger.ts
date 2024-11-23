import * as winston from "winston";
import  'winston-daily-rotate-file';
import env from "../config/env";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "white",
  http: "magenta",
};

winston.addColors(colors);

export class Logger {
  private logger: winston.Logger;
  private context: string;

  constructor(context: string) {
    this.context = context;

    const format = winston.format.combine(
      winston.format.label({
        label: this.context,
      }),
      winston.format.timestamp({
        format: "MMM-DD-YYYY HH:mm:ss",
      }),
      winston.format.printf(
        info =>
          `${info.level}: ${info.label}: ${[info.timestamp]}: ${
            info.message
          } ${
            info.suportingData
              ? JSON.stringify(info.suportingData)
              : ""
          }`,
      ),
    );

    const logger = winston.createLogger({
      levels,
      level: getLevel(),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            format,
            winston.format.colorize({ all: true }),
          ),
        }),
        /*
        new winston.transports.File({
          filename: 'service.log',
          dirname: `${env.storagePaths.project}/../logfiles/`,
          format: format,
        }),
        */
        new winston.transports.DailyRotateFile({
          filename: '%DATE%-service-error.log',
          dirname: `${env.logFolderPath}/`,
          level: 'error',
          format: format,
        }),
        new winston.transports.DailyRotateFile({
          filename: '%DATE%-service-combined.log',
          dirname: `${env.logFolderPath}/`,
          level: 'info',
          format: format,
        })
      ],

    });
    this.logger = logger;
  }

  public info(message: string, suportingData?: unknown): void {
    this.logger.info(message, {
      suportingData,
    });
  }

  public debug(message: string, suportingData?: unknown): void {
    this.logger.debug(message, {
      suportingData,
    });
  }

  public warn(message: string, suportingData?: unknown): void {
    this.logger.warn(message, {
      suportingData,
    });
  }

  public error(message: string, suportingData?: unknown): void {
    this.logger.error(message, {
      suportingData,
    });
  }
}

const getLevel = () => {
  const environment = env.nodeEnv || "development";
  return environment === "development" ? "debug" : "warn";
};

export class LogManager {
  private static instance: LogManager;
  private loggers: Map<string, Logger>;

  private constructor() {
    this.loggers = new Map<string, Logger>();
  }

  public static getInstance(): LogManager {
    if (!LogManager.instance) {
      LogManager.instance = new LogManager();
    }

    return LogManager.instance;
  }

  public get(context: string) : Logger {
    let logger = this.loggers.get(context);
    if (!logger) {
      logger = new Logger (context);
      this.loggers.set(context, logger);
    }
    return logger;
  }
}

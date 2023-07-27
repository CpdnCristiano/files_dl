import { Router, Request, Response, NextFunction } from 'express';
import downloadService from '../services/download.service';
import { ApiError } from '../core/api_error';
import path from 'path';
import {
  facebookdl,
  facebookdlv2,
  savefrom,
  tiktokdl as tk2,
} from '@bochilteam/scraper';
import { TiktokDL as tk1 } from '@tobyg74/tiktok-api-dl';
const HOST = process.env.HOST;

interface ResultModel {
  path: string;
  errorMessage: string | null;
  size: number;
  origin: string;
  filename: string;
  urlDownload: string;
  type: string | null;
  quality: string | null;
}

const downloadRouter = Router();

/**
 * @swagger
 * /api/download:
 *   post:
 *     summary: Baixar um arquivo a partir da URL fornecida.
 *     tags:
 *       - Downloads
 *     requestBody:
 *       required: true
 *       description: Corpo da requisição para baixar o arquivo.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FileRequest'
 *     responses:
 *       200:
 *         description: Download do arquivo realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FileResponse'
 *       400:
 *         description: Ocorreu um erro. Verifique o campo "error" no corpo da resposta para obter mais informações.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Não foram encontrados arquivos para baixar ou ainda não temos suporte para este host.
 *       500:
 *         description: Erro interno do servidor. Falha ao baixar o arquivo.
 */

downloadRouter.post(
  '/download',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res
          .status(400)
          .json({ error: 'O parâmetro URL é obrigatório.' });
      }
      const files = await downloadService(url);
      if (files.length === 0) {
        return res.status(404).json({
          error:
            'Não foi possível baixar o vídeo da URL atual. Estamos trabalhando para melhorar essa funcionalidade.',
        });
      }
      const result: ResultModel[] = [];
      for (const file of files) {
        result.push({
          errorMessage: file.errorMessage,
          filename: path.basename(file.path),
          origin: url as string,
          path: file.path,
          size: file.size,
          urlDownload: `${HOST}/${file.path}`.replace(/\\/g, '/'),
          quality: file.quality,
          type: file.type,
        });
      }
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) {
        return res.status(error.code).json({ error: error.message });
      } else {
        return res.status(500).json({ error: error });
      }
    }
  }
);

downloadRouter.post(
  '/download/savefrom',
  async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res
          .status(400)
          .json({ error: 'O parâmetro URL é obrigatório.' });
      }
      return res.status(200).json(await savefrom(url));
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) {
        return res.status(error.code).json({ error: error.message });
      } else {
        return res.status(500).json({ error: error });
      }
    }
  }
);
downloadRouter.post('/download/tiktok', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'O parâmetro URL é obrigatório.' });
    }
    const result = await Promise.all([
      tryDataOnError(async () => await tk1(url)),
      tryDataOnError(async () => await tk2(url)),
      tryDataOnError(async () => await savefrom(url)),
    ]);
    return res.status(200).json({
      sever1: result[0],
      sever2: result[1],
      savefrom: result[2],
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.code).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error });
    }
  }
});
downloadRouter.post(
  '/download/facebook',
  async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res
          .status(400)
          .json({ error: 'O parâmetro URL é obrigatório.' });
      }
      const result = await Promise.all([
        tryDataOnError(async () => await facebookdl(url)),
        tryDataOnError(async () => await facebookdlv2(url)),
        tryDataOnError(async () => await savefrom(url)),
      ]);
      return res.status(200).json({
        sever1: result[0],
        sever2: result[1],
        savefrom: result[result.length - 1],
      });
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.code).json({ error: error.message });
      } else {
        return res.status(500).json({ error: error });
      }
    }
  }
);
downloadRouter.post('/download/teste', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'O parâmetro URL é obrigatório.' });
    }
    return res.status(200).json(await tk1(url));
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.code).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error });
    }
  }
});

export default downloadRouter;

interface DataApi {
  success: boolean;
  error?: string;
  errorDetails?: any;
  data?: any;
}
type AsyncFunction = () => Promise<any>;
const tryDataOnError = async (fun: AsyncFunction): Promise<DataApi> => {
  try {
    var data = await fun();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: `Ocorreu um erro ao processar a solicitação.`,
      errorDetails: `${error}`,
    };
  }
};

import { getAccessToken } from './auth';

// 图像生成工具类
export class ImageGenerationService {
  private baseUrl: string;

  constructor() {
    // 使用后端API端点 - Vite项目使用VITE_前缀的环境变量
    this.baseUrl = (import.meta as any).env?.VITE_API_URL || 
                   (import.meta as any).env?.VITE_BACKEND_URL || 
                   'https://inkgeniusapi.digworldai.com';
    
    console.log('🔗 API Base URL:', this.baseUrl);
  }

  /**
   * 获取认证token
   */
  private getAuthToken(): string | null {
    return getAccessToken();
  }

  /**
   * 文生图 - 根据文本描述生成图像
   */
  async generateImageFromText(
    prompt: string, 
    options: {
      width?: number;
      height?: number;
      negativePrompt?: string;
    } = {}
  ): Promise<{
    success: boolean;
    imageData?: string;
    error?: string;
    metadata?: any;
  }> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('请先登录');
      }
      
      console.log('🎨 发起文生图请求:', { prompt: prompt.substring(0, 50), hasToken: !!token });
      
      const response = await fetch(`${this.baseUrl}/api/gemini/text-to-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          width: options.width || 512,
          height: options.height || 512,
          negativePrompt: options.negativePrompt
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('❌ API请求失败:', response.status, result);
        throw new Error(result.message || '生成失败');
      }

      console.log('✅ 文生图请求成功');
      return result;
    } catch (error) {
      console.error('文生图生成失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '生成失败'
      };
    }
  }

  /**
   * 图生图 - 基于输入图像和提示词生成新图像
   */
  async generateImageFromImage(
    prompt: string,
    imageFile: File,
    options: {
      strength?: number;
      width?: number;
      height?: number;
    } = {}
  ): Promise<{
    success: boolean;
    imageData?: string;
    error?: string;
    metadata?: any;
  }> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('请先登录');
      }
      
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('image', imageFile);
      if (options.strength) formData.append('strength', options.strength.toString());
      if (options.width) formData.append('width', options.width.toString());
      if (options.height) formData.append('height', options.height.toString());

      const response = await fetch(`${this.baseUrl}/api/gemini/image-to-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || '生成失败');
      }

      return result;
    } catch (error) {
      console.error('图生图生成失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '生成失败'
      };
    }
  }

  /**
   * 图生图 - 使用base64图像数据
   */
  async generateImageFromImageBase64(
    prompt: string,
    imageData: string,
    options: {
      strength?: number;
      width?: number;
      height?: number;
    } = {}
  ): Promise<{
    success: boolean;
    imageData?: string;
    error?: string;
    metadata?: any;
  }> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('请先登录');
      }
      
      const response = await fetch(`${this.baseUrl}/api/gemini/image-to-image-base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          imageData,
          strength: options.strength || 0.7,
          width: options.width || 512,
          height: options.height || 512
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || '生成失败');
      }

      return result;
    } catch (error) {
      console.error('图生图生成失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '生成失败'
      };
    }
  }

  /**
   * STENCIL - 生成纹身模板
   */
  async generateStencil(
    prompt: string,
    imageFile: File,
    options: {
      width?: number;
      height?: number;
    } = {}
  ): Promise<{
    success: boolean;
    imageData?: string;
    error?: string;
    metadata?: any;
  }> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('请先登录');
      }
      
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('image', imageFile);
      if (options.width) formData.append('width', options.width.toString());
      if (options.height) formData.append('height', options.height.toString());

      const response = await fetch(`${this.baseUrl}/api/gemini/stencil`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'STENCIL生成失败');
      }

      return result;
    } catch (error) {
      console.error('STENCIL生成失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'STENCIL生成失败'
      };
    }
  }

  /**
   * TRY-ON - 生成纹身试穿效果
   */
  async generateTryOn(
    prompt: string,
    imageFile: File,
    options: {
      width?: number;
      height?: number;
    } = {}
  ): Promise<{
    success: boolean;
    imageData?: string;
    error?: string;
    metadata?: any;
  }> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('请先登录');
      }
      
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('image', imageFile);
      if (options.width) formData.append('width', options.width.toString());
      if (options.height) formData.append('height', options.height.toString());

      const response = await fetch(`${this.baseUrl}/api/gemini/try-on`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'TRY-ON生成失败');
      }

      return result;
    } catch (error) {
      console.error('TRY-ON生成失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'TRY-ON生成失败'
      };
    }
  }

  /**
   * COVER-UP - 生成纹身遮盖设计
   */
  async generateCoverUp(
    prompt: string,
    imageFile: File,
    options: {
      width?: number;
      height?: number;
    } = {}
  ): Promise<{
    success: boolean;
    imageData?: string;
    error?: string;
    metadata?: any;
  }> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('请先登录');
      }
      
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('image', imageFile);
      if (options.width) formData.append('width', options.width.toString());
      if (options.height) formData.append('height', options.height.toString());

      const response = await fetch(`${this.baseUrl}/api/gemini/cover-up`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'COVER-UP生成失败');
      }

      return result;
    } catch (error) {
      console.error('COVER-UP生成失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'COVER-UP生成失败'
      };
    }
  }
  async getGenerationHistory(limit: number = 20, offset: number = 0) {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('请先登录');
      }
      
      const response = await fetch(
        `${this.baseUrl}/api/gemini/history?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || '获取历史失败');
      }

      return result;
    } catch (error) {
      console.error('获取生成历史失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取历史失败'
      };
    }
  }

  /**
   * 测试API连接
   */
  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/api/gemini/test`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API连接测试失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'API连接失败'
      };
    }
  }
}

// 导出单例实例
export const imageGenService = new ImageGenerationService();
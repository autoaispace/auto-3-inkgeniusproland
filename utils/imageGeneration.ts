// 图像生成工具类
export class ImageGenerationService {
  private baseUrl: string;

  constructor() {
    // 使用后端API端点
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  }

  /**
   * 文生图 - 根据文本描述生成图像
   */
  async generateImageFromText(
    prompt: string, 
    options: {
      style?: string;
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
      const token = localStorage.getItem('supabase.auth.token');
      
      const response = await fetch(`${this.baseUrl}/api/gemini/text-to-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          style: options.style,
          width: options.width || 512,
          height: options.height || 512,
          negativePrompt: options.negativePrompt
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || '生成失败');
      }

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
      style?: string;
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
      const token = localStorage.getItem('supabase.auth.token');
      
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('image', imageFile);
      if (options.style) formData.append('style', options.style);
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
      style?: string;
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
      const token = localStorage.getItem('supabase.auth.token');
      
      const response = await fetch(`${this.baseUrl}/api/gemini/image-to-image-base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          imageData,
          style: options.style,
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
   * 获取生成历史
   */
  async getGenerationHistory(limit: number = 20, offset: number = 0) {
    try {
      const token = localStorage.getItem('supabase.auth.token');
      
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
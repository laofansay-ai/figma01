/**
 * Notification Service
 * 处理应用通知功能
 */

class NotificationService {
  constructor() {
    // 可以集成第三方通知服务如 Firebase, Pusher 等
    this.notifications = []
  }

  /**
   * 显示成功通知
   */
  showSuccess(message, duration = 3000) {
    const notification = {
      id: Date.now(),
      type: 'success',
      message,
      duration,
      timestamp: new Date()
    }
    
    this.notifications.push(notification)
    
    // 触发浏览器通知（如果用户允许）
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Order Success', {
        body: message,
        icon: '/favicon.ico'
      })
    }
    
    // 自动清除
    setTimeout(() => {
      this.removeNotification(notification.id)
    }, duration)
    
    return notification
  }

  /**
   * 显示错误通知
   */
  showError(message, duration = 5000) {
    const notification = {
      id: Date.now(),
      type: 'error',
      message,
      duration,
      timestamp: new Date()
    }
    
    this.notifications.push(notification)
    
    // 自动清除
    setTimeout(() => {
      this.removeNotification(notification.id)
    }, duration)
    
    return notification
  }

  /**
   * 显示信息通知
   */
  showInfo(message, duration = 3000) {
    const notification = {
      id: Date.now(),
      type: 'info',
      message,
      duration,
      timestamp: new Date()
    }
    
    this.notifications.push(notification)
    
    // 自动清除
    setTimeout(() => {
      this.removeNotification(notification.id)
    }, duration)
    
    return notification
  }

  /**
   * 移除通知
   */
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id)
  }

  /**
   * 清除所有通知
   */
  clearAll() {
    this.notifications = []
  }

  /**
   * 获取所有通知
   */
  getNotifications() {
    return this.notifications
  }

  /**
   * 请求浏览器通知权限
   */
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  /**
   * 发送订单确认通知
   */
  sendOrderConfirmation(orderData) {
    const message = `Order #${orderData.order_number || 'N/A'} has been placed successfully! Total: $${orderData.total_amount || 0}`
    
    // 显示应用内通知
    this.showSuccess(message, 5000)
    
    // 模拟发送邮件通知（实际项目中应调用邮件服务API）
    this.sendEmailNotification(orderData)
    
    return { success: true }
  }

  /**
   * 模拟发送邮件通知
   */
  async sendEmailNotification(orderData) {
    try {
      // 这里应该调用实际的邮件服务API
      console.log('Sending email notification for order:', orderData.id)
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Email notification sent successfully')
      return { success: true }
    } catch (error) {
      console.error('Failed to send email notification:', error)
      return { success: false, error }
    }
  }

  /**
   * 发送订单状态更新通知
   */
  sendOrderStatusUpdate(orderId, status, message) {
    const notification = `Order #${orderId} status updated: ${status}`
    
    if (status === 'shipped') {
      this.showInfo(`${notification}. ${message || 'Your order is on the way!'}`)
    } else if (status === 'delivered') {
      this.showSuccess(`${notification}. ${message || 'Your order has been delivered!'}`)
    } else if (status === 'cancelled') {
      this.showError(`${notification}. ${message || 'Your order has been cancelled.'}`)
    } else {
      this.showInfo(notification)
    }
    
    return { success: true }
  }

  /**
   * 发送促销通知
   */
  sendPromotionNotification(promotion) {
    const message = `🎉 ${promotion.title}: ${promotion.description}`
    this.showInfo(message, 7000)
    
    return { success: true }
  }

  /**
   * 发送库存提醒
   */
  sendStockAlert(productName, quantity) {
    const message = `⚠️ Low stock alert: Only ${quantity} ${productName} left in stock!`
    this.showInfo(message, 5000)
    
    return { success: true }
  }
}

// 创建单例实例
export const notificationService = new NotificationService()
export default notificationService
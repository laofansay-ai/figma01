-- 添加缺失的产品字段到 products 表
-- 这些字段将存储计算出的评分和评论数量

-- ===============================
-- 添加评分相关字段
-- ===============================

-- 添加平均评分字段（可选，可以通过计算得出）
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0;

-- 添加评论数量字段（可选，可以通过计算得出）
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- ===============================
-- 创建更新评分统计的函数
-- ===============================

-- 创建函数来更新产品的评分统计
CREATE OR REPLACE FUNCTION update_product_rating_stats(product_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM product_reviews 
      WHERE product_id = product_uuid AND is_approved = true
    ),
    review_count = (
      SELECT COUNT(*)
      FROM product_reviews 
      WHERE product_id = product_uuid AND is_approved = true
    )
  WHERE id = product_uuid;
END;
$$ LANGUAGE plpgsql;

-- ===============================
-- 创建触发器自动更新评分统计
-- ===============================

-- 创建触发器函数
CREATE OR REPLACE FUNCTION trigger_update_product_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- 根据操作类型决定使用哪个产品ID
  IF TG_OP = 'DELETE' THEN
    PERFORM update_product_rating_stats(OLD.product_id);
    RETURN OLD;
  ELSE
    PERFORM update_product_rating_stats(NEW.product_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 删除现有触发器（如果存在）
DROP TRIGGER IF EXISTS update_product_stats_trigger ON product_reviews;

-- 创建触发器
CREATE TRIGGER update_product_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION trigger_update_product_rating_stats();

-- ===============================
-- 初始化现有产品的评分统计
-- ===============================

-- 为所有现有产品更新评分统计
DO $$
DECLARE
  product_record RECORD;
BEGIN
  FOR product_record IN SELECT id FROM products LOOP
    PERFORM update_product_rating_stats(product_record.id);
  END LOOP;
END $$;

-- ===============================
-- 添加索引优化性能
-- ===============================

-- 为新字段添加索引
CREATE INDEX IF NOT EXISTS idx_products_average_rating ON products(average_rating);
CREATE INDEX IF NOT EXISTS idx_products_review_count ON products(review_count);

-- ===============================
-- 验证数据
-- ===============================

-- 显示产品评分统计
SELECT 
  id,
  name,
  average_rating,
  review_count,
  price
FROM products 
WHERE is_active = true
ORDER BY average_rating DESC, review_count DESC
LIMIT 10;

-- 完成消息
DO $$
BEGIN
  RAISE NOTICE '✅ 产品评分字段添加完成！';
  RAISE NOTICE '📊 已添加 average_rating 和 review_count 字段';
  RAISE NOTICE '🔄 已创建自动更新触发器';
  RAISE NOTICE '📈 已为现有产品初始化评分统计';
  RAISE NOTICE '';
  RAISE NOTICE '📝 注意：现在可以使用以下字段：';
  RAISE NOTICE '   - products.average_rating (平均评分)';
  RAISE NOTICE '   - products.review_count (评论数量)';
END $$;
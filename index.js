const express = require('express');
const app = express();
const port = 3000;

// 解析 JSON 请求体
app.use(express.json());

// 引入 signTransaction 函数
const { signTransaction } = require('./js/transaction_deserialize');

// 定义 POST 路由
app.post('/sign-transaction', async (req, res) => {
  const { callData, blockhash, privateKey } = req.body;

  if (!callData || !blockhash || !privateKey) {
    return res.status(400).json({ error: '缺少 callData、blockhash 或 privateKey 参数' });
  }

  try {
    const signedTransaction = await signTransaction(callData, blockhash, privateKey);
    res.json({ data: signedTransaction });
  } catch (error) {
    console.error('签名交易时出错:', error);
    res.status(500).json({ error: '签名交易失败' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器正在监听端口 ${port}`);
});

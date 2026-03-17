import pdfkit
import os

def converter_html_para_pdf(arquivo_entrada, arquivo_saida):
    # --- AJUSTE O CAMINHO ABAIXO SE NECESSÁRIO ---
    # Verifique se o caminho para o binário está correto no seu computador
    caminho_wkhtmltopdf = r'C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe'
    
    if not os.path.exists(caminho_wkhtmltopdf):
        print("ERRO: O executável wkhtmltopdf não foi encontrado no caminho especificado.")
        print(f"Caminho tentado: {caminho_wkhtmltopdf}")
        return

    config = pdfkit.configuration(wkhtmltopdf=caminho_wkhtmltopdf)

    options = {
        'page-size': 'A4',
        'margin-top': '0mm',
        'margin-right': '0mm',
        'margin-bottom': '0mm',
        'margin-left': '0mm',
        'encoding': "UTF-8",
        'no-outline': None,
        'enable-local-file-access': None
    }
    
    try:
        print(f"Iniciando conversão de {arquivo_entrada}...")
        pdfkit.from_file(arquivo_entrada, arquivo_saida, options=options, configuration=config)
        print(f"Sucesso! PDF gerado em: {os.path.abspath(arquivo_saida)}")
    except Exception as e:
        print(f"Erro ao gerar PDF: {e}")

if __name__ == "__main__":
    # Garante que o script procure o arquivo na pasta atual
    converter_html_para_pdf('curri.html', 'Portfolio_Yan_Izawa_PGE.pdf')
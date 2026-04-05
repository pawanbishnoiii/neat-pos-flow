-- Allow business owners and admins to delete invoices
CREATE POLICY "Business owners can delete invoices"
ON public.invoices FOR DELETE
TO public
USING (is_business_owner(auth.uid(), business_id) OR has_role(auth.uid(), 'admin'::app_role));

-- Allow business owners and admins to delete invoice items
CREATE POLICY "Business owners can delete invoice items"
ON public.invoice_items FOR DELETE
TO public
USING (EXISTS (
  SELECT 1 FROM invoices
  WHERE invoices.id = invoice_items.invoice_id
  AND (is_business_owner(auth.uid(), invoices.business_id) OR has_role(auth.uid(), 'admin'::app_role))
));